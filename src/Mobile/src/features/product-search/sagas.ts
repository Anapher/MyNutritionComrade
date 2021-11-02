import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { ProductSearchCompletedAction } from 'src/RootNavigator';
import searchIndex from 'src/services/search-engine';
import getDatabase from 'src/services/sqlite/database-instance';
import { Awaited, ConsumptionTime, FoodPortionProduct, Meal, Product } from 'src/types';
import { selectMeals } from '../meals-overview/selectors';
import { selectProducts } from '../repo-manager/selectors';
import { selectedProductAmount, SelectedProductAmountPayload } from './actions';
import { initializeSearch, setSearchResults, setSearchText } from './reducer';
import { selectSearchConfig, selectSearchText } from './selectors';
import * as mealsRepo from 'src/services/sqlite/meals-repository';
import { mealsLoaded } from '../meals-overview/reducer';
import buildSearchIndex from 'src/services/search-engine/search-index';
import _ from 'lodash';
import getFrequentlyUsedScore from 'src/services/search-engine/score-frequently-used';
import { DateTime } from 'luxon';

const getSearchIndex = (meals: Meal[], products: Record<string, Product>) => {
   console.log('refetch search index');

   return buildSearchIndex(meals, products);
};

const getSearchIndexMemoized = _.memoize(getSearchIndex);

const getScoreFrequentlyUsed = async (time: ConsumptionTime, date: string, todaysDate: string) => {
   // todays date is important to invalidate the memozation every day as getFrequentlyUsedScore() depends on the current date
   const db = await getDatabase();
   console.log('refetch frequently used');

   return await getFrequentlyUsedScore(db, time, DateTime.fromISO(date).weekday % 7);
};

const getScoreFrequentlyUsedMemoized = _.memoize(getScoreFrequentlyUsed);

function* search() {
   const searchText: ReturnType<typeof selectSearchText> = yield select(selectSearchText);
   const searchConfig: ReturnType<typeof selectSearchConfig> = yield select(selectSearchConfig);
   const products: ReturnType<typeof selectProducts> = yield select(selectProducts);
   let meals: ReturnType<typeof selectMeals> = yield select(selectMeals);

   if (!products) return;

   const database: Awaited<ReturnType<typeof getDatabase>> = yield call(getDatabase);

   if (meals === null) {
      const loadedMeals: Awaited<ReturnType<typeof mealsRepo.fetchMeals>> = yield call(mealsRepo.fetchMeals, database);
      yield put(mealsLoaded(loadedMeals));

      meals = loadedMeals;
   }

   const index: Awaited<ReturnType<typeof getSearchIndexMemoized>> = yield call(
      getSearchIndexMemoized,
      meals,
      products,
   );

   let scoreMap = new Map();

   if (searchConfig?.scoreBy) {
      const resultMap: Awaited<ReturnType<typeof getScoreFrequentlyUsedMemoized>> = yield call(
         getScoreFrequentlyUsedMemoized,
         searchConfig.scoreBy.time,
         searchConfig.scoreBy.date,
         DateTime.now().toLocaleString(DateTime.DATE_SHORT),
      );

      scoreMap = resultMap;
   }

   const results = searchIndex(searchText, index, { limit: searchConfig?.limit, scores: scoreMap });

   yield put(setSearchResults(results));
}

function* onSelectedProductAmount({
   payload: { amount, servingType, product, completedAction },
}: PayloadAction<SelectedProductAmountPayload>) {
   const foodPortion: FoodPortionProduct = {
      type: 'product',
      amount,
      servingType,
      product,
   };

   const action: ProductSearchCompletedAction = {
      ...completedAction,
      payload: { ...completedAction.payload, foodPortion },
   };

   yield put(action);
}

function* productSearchSaga() {
   yield takeEvery([setSearchText, initializeSearch], search);
   yield takeEvery(selectedProductAmount, onSelectedProductAmount);
}

export default productSearchSaga;

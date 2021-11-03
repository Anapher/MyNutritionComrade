import { PayloadAction } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { defaultMemoize } from 'reselect';
import { ProductSearchCompletedAction } from 'src/RootNavigator';
import searchIndex from 'src/services/search-engine';
import getFrequentlyUsedScore from 'src/services/search-engine/score-frequently-used';
import buildSearchIndex from 'src/services/search-engine/search-index';
import getDatabase from 'src/services/sqlite/database-instance';
import * as mealsRepo from 'src/services/sqlite/meals-repository';
import {
   Awaited,
   ConsumptionTime,
   FoodPortionItem,
   FoodPortionMeal,
   FoodPortionProduct,
   Meal,
   Product,
} from 'src/types';
import { changeVolume } from 'src/utils/nutrition-utils';
import { getBaseUnit } from 'src/utils/product-utils';
import { mealsLoaded } from '../meals-overview/reducer';
import { selectMeals } from '../meals-overview/selectors';
import { selectProducts } from '../repo-manager/selectors';
import {
   selectedMealPortion,
   SelectedMealPortionPayload,
   selectedProductAmount,
   SelectedProductAmountPayload,
} from './actions';
import { initializeSearch, setSearchResults, setSearchText } from './reducer';
import { selectSearchConfig, selectSearchText } from './selectors';

const getSearchIndex = (meals: Meal[], products: Record<string, Product>) => {
   console.log('refetch search index');

   return buildSearchIndex(meals, products);
};

const getSearchIndexMemoized = defaultMemoize(getSearchIndex);

const getScoreFrequentlyUsed = async (time: ConsumptionTime, date: string, todaysDate: string) => {
   // todays date is important to invalidate the memozation every day as getFrequentlyUsedScore() depends on the current date
   const db = await getDatabase();
   console.log('refetch frequently used');

   return await getFrequentlyUsedScore(db, time, DateTime.fromISO(date).weekday % 7);
};

const getScoreFrequentlyUsedMemoized = defaultMemoize(getScoreFrequentlyUsed);

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

function* onMealPortionSelected({
   payload: { meal, portion, completedAction },
}: PayloadAction<SelectedMealPortionPayload>) {
   const foodPortion: FoodPortionMeal = {
      type: 'meal',
      mealId: meal.id,
      mealName: meal.name,
      portion,
      items: meal.items.map((x) => changeFoodItemPortion(x, portion)),
   };

   const action: ProductSearchCompletedAction = {
      ...completedAction,
      payload: { ...completedAction.payload, foodPortion },
   };

   yield put(action);
}

function changeFoodItemPortion(item: FoodPortionItem, portion: number): FoodPortionItem {
   switch (item.type) {
      case 'product':
         if (portion === 1) return item;

         return {
            ...item,
            servingType: getBaseUnit(item.product),
            amount: Math.round(item.amount * item.product.servings[item.servingType] * portion),
         };
      case 'custom':
         return { ...item, nutritionalInfo: changeVolume(item.nutritionalInfo, item.nutritionalInfo.volume * portion) };
   }
}

function* productSearchSaga() {
   yield takeEvery([setSearchText, initializeSearch], search);
   yield takeEvery(selectedProductAmount, onSelectedProductAmount);
   yield takeEvery(selectedMealPortion, onMealPortionSelected);
}

export default productSearchSaga;

import { PayloadAction } from '@reduxjs/toolkit';
import { put, select, takeEvery } from 'redux-saga/effects';
import { ProductSearchCompletedAction } from 'src/RootNavigator';
import searchProducts from 'src/services/search-engine';
import { ProductSearchConfig } from 'src/services/search-engine/types';
import { FoodPortionProduct, Product } from 'src/types';
import { selectProducts } from '../repo-manager/selectors';
import { selectedProductAmount, SelectedProductAmountPayload } from './actions';
import { initializeSearch, setSearchResults, setSearchText } from './reducer';
import { selectSearchConfig, selectSearchText } from './selectors';

function* search() {
   const searchText: string = yield select(selectSearchText);
   const searchConfig: ProductSearchConfig | null = yield select(selectSearchConfig);
   const products: Record<string, Product> | undefined = yield select(selectProducts);

   if (!products) return;

   const results = searchProducts(searchText, Object.values(products), searchConfig ?? undefined);
   yield put(setSearchResults(results));
}

function* onSelectedProductAmount({
   payload: { amount, servingType, product, completedAction },
}: PayloadAction<SelectedProductAmountPayload>) {
   const creationDto: FoodPortionProduct = {
      type: 'product',
      amount,
      servingType,
      product,
   };

   const action: ProductSearchCompletedAction = {
      ...completedAction,
      payload: { ...completedAction.payload, foodPortion: creationDto },
   };

   yield put(action);
}

function* productSearchSaga() {
   yield takeEvery([setSearchText, initializeSearch], search);
   yield takeEvery(selectedProductAmount, onSelectedProductAmount);
}

export default productSearchSaga;

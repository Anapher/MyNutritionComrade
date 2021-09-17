import { selectedProductAmount, SelectedProductAmountPayload } from './actions';
import { put, select, takeEvery } from 'redux-saga/effects';
import searchProducts from 'src/services/search-engine';
import { ProductSearchConfig } from 'src/services/search-engine/types';
import { selectProducts } from '../repo-manager/selectors';
import { Product, ProductFoodPortionCreationDto } from 'src/types';
import { initializeSearch, setSearchResults, setSearchText } from './reducer';
import { selectSearchConfig, selectSearchText } from './selectors';
import { PayloadAction } from '@reduxjs/toolkit';
import { createProductPortionFromCreation } from 'src/utils/food-creation-utils';
import { ProductSearchCompletedAction } from 'src/RootNavigator';

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
   const creationDto: ProductFoodPortionCreationDto = {
      type: 'product',
      amount,
      servingType,
      productId: product.id,
   };

   const foodPortion = createProductPortionFromCreation(creationDto, product);

   const action: ProductSearchCompletedAction = {
      ...completedAction,
      payload: { ...completedAction.payload, creationDto, foodPortion },
   };

   yield put(action);
}

function* productSearchSaga() {
   yield takeEvery([setSearchText, initializeSearch], search);
   yield takeEvery(selectedProductAmount, onSelectedProductAmount);
}

export default productSearchSaga;

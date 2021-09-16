import { put, select, takeEvery } from 'redux-saga/effects';
import searchProducts from 'src/services/search-engine';
import { ProductSearchConfig } from 'src/services/search-engine/types';
import { selectProducts } from '../repo-manager/selectors';
import { Product } from './../../types';
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

function* productSearchSaga() {
   yield takeEvery([setSearchText, initializeSearch], search);
}

export default productSearchSaga;

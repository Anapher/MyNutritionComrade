import { call, put, select, takeEvery } from 'redux-saga/effects';
import config from 'src/config';
import { downloadProductRepositories } from 'src/services/product-repository-downloader';
import { createProductRepository, InitializationResult } from 'src/services/product-repository-factory';
import {
   downloadRepositoryUpdates,
   downloadRepositoryUpdatesFinished,
   initialize,
   setInitializationResult,
} from './reducer';
import { selectInitializationResult } from './selectors';

function* initializeRepository() {
   const result: InitializationResult = yield call(createProductRepository, config.productRepositories);
   yield put(setInitializationResult(result));
}

function* downloadUpdates() {
   const state: InitializationResult | undefined = yield select(selectInitializationResult);

   if (!state) return;
   if (state.type === 'ready') return;

   let links = config.productRepositories;
   if (state.type === 'update-required') {
      links = links.filter((x) => state.reposThatNeedUpdate.includes(x.key));
   }

   yield call(downloadProductRepositories, links);
   yield call(initializeRepository);

   yield put(downloadRepositoryUpdatesFinished());
}

function* repoManagerSaga() {
   yield takeEvery(initialize, initializeRepository);
   yield takeEvery(downloadRepositoryUpdates, downloadUpdates);
}

export default repoManagerSaga;

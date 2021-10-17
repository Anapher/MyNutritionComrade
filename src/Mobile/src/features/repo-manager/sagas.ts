import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import config from 'src/config';
import { updateProductRepository } from 'src/services/product-repository-downloader';
import { createProductIndex, InitializationResult } from 'src/services/product-index-factory';
import {
   downloadRepositoryUpdates,
   downloadRepositoryUpdatesFinished,
   initialize,
   setInitializationResult,
   updateRepository,
} from './reducer';
import { selectInitializationResult } from './selectors';

function* initializeRepository() {
   const result: InitializationResult = yield call(createProductIndex, config.productRepositories);
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

   for (const link of links) {
      console.log('Update repository', link.url);
      yield call(updateProductRepository, link);
   }

   yield call(initializeRepository);

   yield put(downloadRepositoryUpdatesFinished());
}

function* handleUpdateRepository({ payload }: PayloadAction<string>) {
   const link = config.productRepositories.find((x) => x.key === payload);
   if (!link) {
      console.error('Invalid link key submitted');
      return;
   }

   console.log('update repo', link.url);

   yield call(updateProductRepository, link);
   yield call(initializeRepository);
   yield put(downloadRepositoryUpdatesFinished());
}

function* repoManagerSaga() {
   yield takeEvery(initialize, initializeRepository);
   yield takeEvery(downloadRepositoryUpdates, downloadUpdates);
   yield takeEvery(updateRepository, handleUpdateRepository);
}

export default repoManagerSaga;

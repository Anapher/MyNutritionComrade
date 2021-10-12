import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import config from 'src/config';
import { downloadProductRepositories } from 'src/services/product-repository-downloader';
import { createProductRepository, InitializationResult } from 'src/services/product-repository-factory';
import { updateRepository } from './actions';
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

function* handleUpdateRepository({ payload }: PayloadAction<string>) {
   const link = config.productRepositories.find((x) => x.key === payload);
   if (!link) {
      console.error('Invalid link submitted');
      return;
   }

   yield call(downloadProductRepositories, [link]);
   yield call(initializeRepository);
}

function* repoManagerSaga() {
   yield takeEvery(initialize, initializeRepository);
   yield takeEvery(downloadRepositoryUpdates, downloadUpdates);
   yield takeEvery(updateRepository, handleUpdateRepository);
}

export default repoManagerSaga;

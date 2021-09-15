import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { ProductSearchConfig } from 'src/services/search-engine/types';
import getDatabase from 'src/services/sqlite/database-instance';
import { fetchConsumedPortionsOfDay } from 'src/services/sqlite/diary-repository';
import { SQLiteDatabase } from 'src/services/sqlite/types';
import { ConsumedPortion } from 'src/types';
import { initializeSearch, setSearchText } from './reducer';
import { selectSearchConfig, selectSearchText } from './selectors';

function* search({ payload }: PayloadAction<string>) {
   const searchText: string = yield select(selectSearchText);
   const searchConfig: ProductSearchConfig | null = yield select(selectSearchConfig);
}

function* productSearchSaga() {
   yield takeEvery([setSearchText, initializeSearch], search);
}

export default productSearchSaga;

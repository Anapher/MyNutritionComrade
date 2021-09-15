import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';
import getDatabase from 'src/services/sqlite/database-instance';
import { fetchConsumedPortionsOfDay } from 'src/services/sqlite/diary-repository';
import { SQLiteDatabase } from 'src/services/sqlite/types';
import { ConsumedPortion } from 'src/types';
import { selectedDateLoaded, setSelectedDate } from './reducer';

function* loadSelectedDate({ payload }: PayloadAction<string>) {
   const database: SQLiteDatabase = yield call(getDatabase);
   const result: ConsumedPortion[] = yield call(fetchConsumedPortionsOfDay, database, payload);

   yield put(selectedDateLoaded(result));
}

function* diarySaga() {
   yield takeEvery(setSelectedDate, loadSelectedDate);
}

export default diarySaga;

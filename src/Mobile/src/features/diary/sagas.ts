import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import getDatabase from 'src/services/sqlite/database-instance';
import {
   fetchConsumedPortionsOfDay,
   removeConsumedPortion,
   setConsumedPortion,
} from 'src/services/sqlite/diary-repository';
import { SQLiteDatabase } from 'src/services/sqlite/types';
import { ConsumedPortion } from 'src/types';
import { getFoodPortionId, mergeFoodPortions } from 'src/utils/product-utils';
import {
   addConsumption,
   AddConsumptionPayload,
   ConsumptionId,
   ConsumptionPayload,
   removeConsumption,
   setConsumption,
   setConsumptionDialogAction,
   SetConsumptionDialogActionPayload,
} from './actions';
import { selectedDateLoaded, setSelectedDate } from './reducer';
import { getSelectedDate, selectConsumedPortions } from './selectors';

function* loadSelectedDate({ payload }: PayloadAction<string>) {
   const database: SQLiteDatabase = yield call(getDatabase);
   const result: ConsumedPortion[] = yield call(fetchConsumedPortionsOfDay, database, payload);

   yield put(selectedDateLoaded(result));
}

function* onAddConsumption({ payload: { date, time, append, creationDto } }: PayloadAction<AddConsumptionPayload>) {
   if (append) {
      const consumedFood: ConsumedPortion[] | null = yield select(selectConsumedPortions);
      const existing = consumedFood?.find(
         (x) => x.date === date && x.time === time && getFoodPortionId(x.foodPortion) === getFoodPortionId(creationDto),
      );

      if (existing) {
         creationDto = mergeFoodPortions(creationDto, existing.foodPortion);
      }
   }

   yield call(onSetConsumption, setConsumption({ creationDto, date, time }));
}

function* onSetConsumption({ payload: { date, time, creationDto } }: PayloadAction<ConsumptionPayload>) {
   const database: SQLiteDatabase = yield call(getDatabase);
   yield call(setConsumedPortion, database, date, time, creationDto);

   yield call(refreshCurrentDate);
}

function* onRemoveConsumption({ payload: { date, time, foodId } }: PayloadAction<ConsumptionId>) {
   const database: SQLiteDatabase = yield call(getDatabase);
   yield call(removeConsumedPortion, database, date, time, foodId);

   yield call(refreshCurrentDate);
}

function* refreshCurrentDate() {
   const selectedDate: string | null = yield select(getSelectedDate);
   if (selectedDate) {
      yield call(loadSelectedDate, setSelectedDate(selectedDate));
   }
}

function* onSetConsumptionDialogAction({
   payload: { date, time, amount, servingType, creationDto },
}: PayloadAction<SetConsumptionDialogActionPayload>) {
   yield put(setConsumption({ date, time, creationDto: { ...creationDto, amount, servingType } }));
}

function* diarySaga() {
   yield takeEvery(setSelectedDate, loadSelectedDate);
   yield takeEvery(addConsumption, onAddConsumption);
   yield takeEvery(setConsumption, onSetConsumption);
   yield takeEvery(setConsumptionDialogAction, onSetConsumptionDialogAction);
   yield takeEvery(removeConsumption, onRemoveConsumption);
}

export default diarySaga;

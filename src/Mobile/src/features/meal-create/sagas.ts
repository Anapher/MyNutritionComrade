import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeEvery } from 'redux-saga/effects';
import getDatabase from 'src/services/sqlite/database-instance';
import * as mealsRepo from 'src/services/sqlite/meals-repository';
import { Meal } from 'src/types';
import { loadMeals } from '../meals-overview/actions';
import { changeMeal, createMeal } from './actions';

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

function* handleCreateMeal({ payload }: PayloadAction<Omit<Meal, 'id'>>) {
   const database: Awaited<ReturnType<typeof getDatabase>> = yield call(getDatabase);
   yield call(mealsRepo.createMeal, database, payload);

   yield put(loadMeals());
}

function* handleChangeMeal({ payload }: PayloadAction<Meal>) {
   const database: Awaited<ReturnType<typeof getDatabase>> = yield call(getDatabase);
   yield call(mealsRepo.updateMeal, database, payload);

   yield put(loadMeals());
}

function* mealSaga() {
   yield takeEvery(createMeal, handleCreateMeal);
   yield takeEvery(changeMeal, handleChangeMeal);
}

export default mealSaga;

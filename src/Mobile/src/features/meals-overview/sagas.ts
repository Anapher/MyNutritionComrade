import { call, put, takeEvery } from 'redux-saga/effects';
import getDatabase from 'src/services/sqlite/database-instance';
import * as mealsRepo from 'src/services/sqlite/meals-repository';
import { Awaited } from 'src/types';
import { loadMeals } from './actions';
import { mealsLoaded } from './reducer';

function* handleLoadMeals() {
   const database: Awaited<ReturnType<typeof getDatabase>> = yield call(getDatabase);
   const meals: Awaited<ReturnType<typeof mealsRepo.fetchMeals>> = yield call(mealsRepo.fetchMeals, database);
   yield put(mealsLoaded(meals));
}

function* mealSaga() {
   yield takeEvery(loadMeals, handleLoadMeals);
}

export default mealSaga;

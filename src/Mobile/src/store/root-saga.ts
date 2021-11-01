import { spawn } from 'redux-saga/effects';
import diary from '../features/diary/sagas';
import productAdd from '../features/product-add/sagas';
import productSearch from '../features/product-search/sagas';
import repoManager from '../features/repo-manager/sagas';
import settings from '../features/settings/sagas';
import productOverview from '../features/product-overview/sagas';
import mealCreate from '../features/meal-create/sagas';
import mealsOverview from '../features/meals-overview/sagas';

export default function* rootSaga() {
   yield spawn(repoManager);
   yield spawn(diary);
   yield spawn(productSearch);
   yield spawn(settings);
   yield spawn(productAdd);
   yield spawn(productOverview);
   yield spawn(mealCreate);
   yield spawn(mealsOverview);
}

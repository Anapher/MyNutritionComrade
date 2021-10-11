import { spawn } from 'redux-saga/effects';
import repoManager from '../features/repo-manager/sagas';
import diary from '../features/diary/sagas';
import productSearch from '../features/product-search/sagas';
import settings from '../features/settings/sagas';

export default function* rootSaga() {
   yield spawn(repoManager);
   yield spawn(diary);
   yield spawn(productSearch);
   yield spawn(settings);
}

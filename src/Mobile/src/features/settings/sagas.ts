import { select, takeEvery } from '@redux-saga/core/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { REHYDRATE } from 'redux-persist';
import { AuthSettings, setAuthentication } from './reducer';
import { selectAuthInfo } from './selectors';

function* onSetAuthentication({ payload }: PayloadAction<AuthSettings>) {
   applyAuthSettings(payload);
}

function* onSettingsLoaded() {
   const authSettings: AuthSettings | undefined = yield select(selectAuthInfo);
   if (authSettings) {
      applyAuthSettings(authSettings);
   }
}

function applyAuthSettings({ token }: AuthSettings) {
   axios.defaults.headers = { Authorization: `Bearer ${token}` };
}

function* settingsSaga() {
   yield takeEvery(setAuthentication, onSetAuthentication);
   yield takeEvery(REHYDRATE, onSettingsLoaded);
}

export default settingsSaga;

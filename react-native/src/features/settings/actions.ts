import { createAsyncAction } from 'typesafe-actions';
import { UserSettings } from 'Models';
import { RequestErrorResponse } from 'src/utils/error-result';
import { Operation } from 'fast-json-patch';

export const loadUserSettings = createAsyncAction(
    'SETTINGS/LOAD_USER_SETTINGS_REQUEST',
    'SETTINGS/LOAD_USER_SETTINGS_SUCCESS',
    'SETTINGS/LOAD_USER_SETTINGS_FAILURE',
)<undefined, UserSettings, RequestErrorResponse>();

export const patchUserSettings = createAsyncAction(
    'SETTINGS/PATCH_USER_SETTINGS_REQUEST',
    'SETTINGS/PATCH_USER_SETTINGS_SUCCESS',
    'SETTINGS/PATCH_USER_SETTINGS_FAILURE',
)<Operation[], UserSettings, RequestErrorResponse>();

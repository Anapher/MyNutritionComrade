import { LoggedWeight } from 'Models';
import { PagingResponse } from 'MyNutritionComrade';
import { RequestErrorResponse } from 'src/utils/error-result';
import { createAsyncAction } from 'typesafe-actions';

export const loadLoggedWeight = createAsyncAction(
    'LOG_WEIGHT/LOAD_REQUEST',
    'LOG_WEIGHT/LOAD_SUCCESS',
    'LOG_WEIGHT/LOAD_FAILURE',
)<undefined, PagingResponse<LoggedWeight>, RequestErrorResponse>();

export const addLoggedWeight = createAsyncAction(
    'LOG_WEIGHT/ADD_REQUEST',
    'LOG_WEIGHT/ADD_SUCCESS',
    'LOG_WEIGHT/ADD_FAILURE',
)<LoggedWeight, LoggedWeight, RequestErrorResponse>();

export const removeLoggedWeight = createAsyncAction(
    'LOG_WEIGHT/REMOVE_REQUEST',
    'LOG_WEIGHT/REMOVE_SUCCESS',
    'LOG_WEIGHT/REMOVE_FAILURE',
)<string, string, RequestErrorResponse>();

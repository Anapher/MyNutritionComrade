import { createAsyncAction } from 'typesafe-actions';
import { Meal } from 'Models';
import { RequestErrorResponse } from 'src/utils/error-result';

export const loadMealsAsync = createAsyncAction('MEALS/LOAD_REQUEST', 'MEALS/LOAD_SUCCESS', 'MEALS/LOAD_FAILURE')<
    undefined,
    Meal[],
    RequestErrorResponse
>();

export const removeAsync = createAsyncAction('MEALS/REMOVE_REQUEST', 'MEALS/REMOVE_SUCCESS', 'MEALS/REMOVE_FAILURE')<
    string,
    string,
    RequestErrorResponse
>();

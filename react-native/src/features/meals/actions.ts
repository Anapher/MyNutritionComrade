import { CreateMealDto, Meal } from 'Models';
import { RequestErrorResponse } from 'src/utils/error-result';
import { createAsyncAction } from 'typesafe-actions';

export const loadMealsAsync = createAsyncAction('MEALS/LOAD_REQUEST', 'MEALS/LOAD_SUCCESS', 'MEALS/LOAD_FAILURE')<
    undefined,
    Meal[],
    RequestErrorResponse
>();

export const createAsync = createAsyncAction('MEALS/CREATE_REQUEST', 'MEALS/CREATE_SUCCESS', 'MEALS/CREATE_FAILURE')<
    CreateMealDto,
    Meal,
    RequestErrorResponse
>();

export const removeAsync = createAsyncAction('MEALS/REMOVE_REQUEST', 'MEALS/REMOVE_SUCCESS', 'MEALS/REMOVE_FAILURE')<
    string,
    string,
    RequestErrorResponse
>();

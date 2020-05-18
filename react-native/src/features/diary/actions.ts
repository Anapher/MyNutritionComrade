import cuid from 'cuid';
import { ComputedNutritionGoals, FrequentlyUsedProducts, ProductConsumptionDates } from 'Models';
import { RequestErrorResponse } from 'src/utils/error-result';
import { createAction, createAsyncAction } from 'typesafe-actions';
import { ConsumptionAction } from './reducer';

export const loadFrequentlyUsedProducts = createAsyncAction(
    'DIARY/LOAD_FREQUENTLYUSEDPRODUCTS_REQUEST',
    'DIARY/LOAD_FREQUENTLYUSEDPRODUCTS_SUCCESS',
    'DIARY/LOAD_FREQUENTLYUSEDPRODUCTS_FAILURE',
)<undefined, FrequentlyUsedProducts, RequestErrorResponse>();

export const setSelectedDate = createAsyncAction(
    'DIARY/SET_SELECTED_DATE_REQUEST',
    'DIARY/SET_SELECTED_DATE_SUCCESS',
    'DIARY/SET_SELECTED_DATE_FAILURE',
)<string, { date: string; data: ProductConsumptionDates }, RequestErrorResponse>();

export const patchConsumptions = {
    request: createAction(
        'DIARY/PATCH_CONSUMPTION_REQUEST',
        (payload: Omit<ConsumptionAction, 'requestId'>) =>
            ({
                ...payload,
                requestId: cuid(),
            } as ConsumptionAction),
    )(),
    success: createAction('DIARY/PATCH_CONSUMPTION_SUCCESS')<ConsumptionAction>(),
    failure: createAction('DIARY/PATCH_CONSUMPTION_FAILURE')<RequestErrorResponse & { requestId: string }>(),
};
export const loadNutritionGoal = createAsyncAction(
    'DIARY/LOAD_NUTRITION_GOAL_REQUEST',
    'DIARY/LOAD_NUTRITION_GOAL_SUCCESS',
    'DIARY/LOAD_NUTRITION_GOAL_FAILURE',
)<undefined, ComputedNutritionGoals, RequestErrorResponse>();

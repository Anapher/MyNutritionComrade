import cuid from 'cuid';
import { ComputedNutritionGoals, FrequentlyConsumed, ProductConsumptionDates } from 'Models';
import { RequestErrorResponse } from 'src/utils/error-result';
import { createAction, createAsyncAction } from 'typesafe-actions';
import { ConsumptionAction, CreateConsumptionRequest, DeleteConsumptionRequest } from './reducer';

export const loadFrequentlyUsedProducts = createAsyncAction(
    'DIARY/LOAD_FREQUENTLY_CONSUMED_REQUEST',
    'DIARY/LOAD_FREQUENTLY_CONSUMED_SUCCESS',
    'DIARY/LOAD_FREQUENTLY_CONSUMED_FAILURE',
)<undefined, FrequentlyConsumed, RequestErrorResponse>();

export const setSelectedDate = createAsyncAction(
    'DIARY/SET_SELECTED_DATE_REQUEST',
    'DIARY/SET_SELECTED_DATE_SUCCESS',
    'DIARY/SET_SELECTED_DATE_FAILURE',
)<string, { date: string; data: ProductConsumptionDates }, RequestErrorResponse>();

type ConsumptionActionX = Omit<CreateConsumptionRequest, 'requestId'> | Omit<DeleteConsumptionRequest, 'requestId'>;

export const patchConsumptions = {
    request: createAction(
        'DIARY/PATCH_CONSUMPTION_REQUEST',
        (payload: ConsumptionActionX) =>
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

import { createAsyncAction } from 'typesafe-actions';
import { UserNutritionGoal } from 'Models';
import { RequestErrorResponse } from 'src/utils/error-result';

export const loadCurrentNutritionGoal = createAsyncAction(
    'SETTINGS/LOAD_CURRENT_NUTRITION_GOAL_REQUEST',
    'SETTINGS/LOAD_CURRENT_NUTRITION_GOAL_SUCCESS',
    'SETTINGS/LOAD_CURRENT_NUTRITION_GOAL_FAILURE',
)<undefined, UserNutritionGoal, RequestErrorResponse>();

export const patchNutritionGoal = createAsyncAction(
    'SETTINGS/PATCH_NUTRITION_GOAL_REQUEST',
    'SETTINGS/PATCH_NUTRITION_GOAL_SUCCESS',
    'SETTINGS/PATCH_NUTRITION_GOAL_FAILURE',
)<Partial<UserNutritionGoal>, UserNutritionGoal, RequestErrorResponse>();

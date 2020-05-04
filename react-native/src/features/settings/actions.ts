import { createAsyncAction } from 'typesafe-actions';
import { UserNutritionGoal, UserPersonalInfo } from 'Models';
import { RequestErrorResponse } from 'src/utils/error-result';
import { Operation } from 'fast-json-patch';

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

export const loadPersonalInfo = createAsyncAction(
    'SETTINGS/LOAD_PERSONAL_INFO_REQUEST',
    'SETTINGS/LOAD_PERSONAL_INFO_SUCCESS',
    'SETTINGS/LOAD_PERSONAL_INFO_FAILURE',
)<undefined, UserPersonalInfo, RequestErrorResponse>();

export const patchPersonalInfo = createAsyncAction(
    'SETTINGS/PATCH_PERSONAL_INFO_REQUEST',
    'SETTINGS/PATCH_PERSONAL_INFO_SUCCESS',
    'SETTINGS/PATCH_PERSONAL_INFO_FAILURE',
)<Operation[], UserPersonalInfo, RequestErrorResponse>();

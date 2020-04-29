import { createAsyncAction } from 'typesafe-actions';
import { UserNutritionGoal } from 'Models';
import { RequestErrorResponse } from 'src/utils/error-result';

export const loadCurrentNutritionGoal = createAsyncAction(
    'NUTRITIONGOALS/LOAD_CURRENT_NUTRITION_GOAL_REQUEST',
    'NUTRITIONGOALS/LOAD_CURRENT_NUTRITION_GOAL_SUCCESS',
    'NUTRITIONGOALS/LOAD_CURRENT_NUTRITION_GOAL_FAILURE',
)<undefined, UserNutritionGoal, RequestErrorResponse>();

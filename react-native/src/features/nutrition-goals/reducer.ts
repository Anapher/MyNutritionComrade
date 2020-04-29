import { UserNutritionGoal } from 'Models';
import { RootAction } from 'MyNutritionComrade';
import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import * as actions from './actions';
import { RequestErrorResponse } from 'src/utils/error-result';

export type NutritionGoalState = Readonly<{
    nutritionGoal: UserNutritionGoal | null;
    isLoading: boolean;
    error: RequestErrorResponse | null;
}>;

export default combineReducers<NutritionGoalState, RootAction>({
    nutritionGoal: (state = null, action) => {
        switch (action.type) {
            case getType(actions.loadCurrentNutritionGoal.success):
                return action.payload;
        }
        return state;
    },
    isLoading: (state = false, action) => {
        switch (action.type) {
            case getType(actions.loadCurrentNutritionGoal.success):
            case getType(actions.loadCurrentNutritionGoal.failure):
                return false;
            case getType(actions.loadCurrentNutritionGoal.request):
                return true;
        }
        return state;
    },
    error: (state = null, action) => {
        switch (action.type) {
            case getType(actions.loadCurrentNutritionGoal.failure):
                return action.payload;
            case getType(actions.loadCurrentNutritionGoal.success):
                return null;
        }
        return state;
    },
});

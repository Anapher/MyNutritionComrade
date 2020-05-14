import { Meal } from 'Models';
import { RootAction } from 'MyNutritionComrade';
import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import * as actions from './actions';

export type MealsState = Readonly<{
    meals: Meal[] | null;
    isLoading: boolean;
}>;

export default combineReducers<MealsState, RootAction>({
    meals: (state = null, action) => {
        switch (action.type) {
            case getType(actions.loadMealAsync.success):
                return action.payload;
            default:
                return state;
        }
    },
    isLoading: (state = false, action) => {
        switch (action.type) {
            case getType(actions.loadMealAsync.request):
                return true;
            case getType(actions.loadMealAsync.success):
            case getType(actions.loadMealAsync.failure):
                return false;
            default:
                return state;
        }
    },
});

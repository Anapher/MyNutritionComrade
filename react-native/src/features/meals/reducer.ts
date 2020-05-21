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
            case getType(actions.loadMealsAsync.success):
                return action.payload;
            case getType(actions.removeAsync.success):
                return state ? state.filter((x) => x.id !== action.payload) : state;
            case getType(actions.createAsync.success):
                return state && [...state, action.payload];
            default:
                return state;
        }
    },
    isLoading: (state = false, action) => {
        switch (action.type) {
            case getType(actions.loadMealsAsync.request):
                return true;
            case getType(actions.loadMealsAsync.success):
            case getType(actions.loadMealsAsync.failure):
                return false;
            default:
                return state;
        }
    },
});

import { FoodSuggestion } from 'Models';
import { MealType } from 'Models';
import { RootAction } from 'MyNutritionComrade';
import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import * as actions from './actions';

export type ProductSearchState = Readonly<{
    searchText: string;
    mealType: MealType;
    suggestions: FoodSuggestion[];
}>;

export default combineReducers<ProductSearchState, RootAction>({
    searchText: (state = '', action) => {
        switch (action.type) {
            case getType(actions.setSearchText):
                return action.payload;
            case getType(actions.initSearch):
                return '';
            default:
                return state;
        }
    },
    mealType: (state = 'Lunch', action) => {
        switch (action.type) {
            case getType(actions.initSearch):
                return action.payload;
            default:
                return state;
        }
    },
    suggestions: (state = [], action) => {
        switch (action.type) {
            case getType(actions.initSearch):
                return [];
            case getType(actions.setSuggestions):
                return action.payload;
            default:
                return state;
        }
    },
});

import { FoodSuggestion } from 'Models';
import { ConsumptionTime } from 'Models';
import { RootAction } from 'MyNutritionComrade';
import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import * as actions from './actions';

export type ProductSearchState = Readonly<{
    searchText: string;
    consumptionTime: ConsumptionTime;
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
    consumptionTime: (state = 'Lunch', action) => {
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
            case getType(actions.appendSuggestions):
                return [...state, ...action.payload];
            default:
                return state;
        }
    },
});

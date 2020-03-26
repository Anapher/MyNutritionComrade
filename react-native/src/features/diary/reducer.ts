import { ConsumedProduct, FrequentlyUsedProducts } from 'Models';
import { RootAction } from 'MyNutritionComrade';
import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import * as actions from './actions';

export type DiaryState = Readonly<{
    currentDate: string;
    consumedProducts: ConsumedProduct[];
    frequentlyUsedProducts: FrequentlyUsedProducts;
}>;

export default combineReducers<DiaryState, RootAction>({
    currentDate: (state = '', action) => {
        return state;
    },
    consumedProducts: (state = [], action) => {
        return state;
    },
    frequentlyUsedProducts: (state = [], action) => {
        switch (action.type) {
            case getType(actions.loadFrequentlyUsedProducts.success):
                return action.payload;
            default:
                return state;
        }
    },
});

import { ProductContributionDto, ProductInfo } from 'Models';
import { RootAction, PagingResponse } from 'MyNutritionComrade';
import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import * as actions from './actions';
import { selectScale } from './utils';
import _ from 'lodash';

export type CurveScale = {
    max: number;
    step: number;
    labelStep: number;
};

export type ProductSlider = {
    amount: number;
    servingType: string;
    product: ProductInfo;
    curve: CurveScale;
};

export type AddProductState = Readonly<{
    slider: ProductSlider | null;
    pendingContributions: PagingResponse<ProductContributionDto> | null;
}>;

function getServingType(product: ProductInfo, givenAmount?: number, givenServingType?: string): string {
    let servingType: string | undefined = undefined;

    if (givenServingType !== undefined) {
        const factor = product.servings[givenServingType];
        if (factor !== undefined) {
            return givenServingType;
        }
    }

    if (servingType === undefined) {
        servingType = product.defaultServing;
        if (givenAmount) {
            servingType =
                _(Object.keys(product.servings))
                    .filter((x) => givenAmount % product.servings[x] === 0)
                    .orderBy((x) => product.servings[x], 'desc')
                    .first() || servingType;
        }
    }

    return servingType;
}

export default combineReducers<AddProductState, RootAction>({
    slider: (state = null, action) => {
        switch (action.type) {
            case getType(actions.init): {
                const { product, amount, servingType } = action.payload;

                let selectedServingType = getServingType(product, amount, servingType);

                const curve = selectScale(product.servings[selectedServingType], product.nutritionalInfo);

                let selectedAmount = curve.labelStep;
                if (amount) {
                    selectedAmount = amount - (amount % curve.step);
                }

                return { curve, amount: selectedAmount, product, servingType: selectedServingType };
            }
            case getType(actions.setAmount):
                return state && { ...state, amount: action.payload };
            case getType(actions.setServing): {
                if (state === null) return null;

                const curve = selectScale(state.product.servings[action.payload], state.product.nutritionalInfo);
                return { ...state, servingType: action.payload, curve, amount: curve.labelStep };
            }
        }
        return state;
    },
    pendingContributions: (state = null, action) => {
        switch (action.type) {
            case getType(actions.init):
                return null;
            case getType(actions.loadContributionsAsync.success):
                return action.payload;
            default:
                return state;
        }
    },
});

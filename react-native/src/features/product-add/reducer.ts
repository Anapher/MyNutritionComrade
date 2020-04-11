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
    volume: number;
    selectedServing: string;
    product: ProductInfo;
    curve: CurveScale;
};

export type AddProductState = Readonly<{
    slider: ProductSlider | null;
    pendingContributions: PagingResponse<ProductContributionDto> | null;
}>;

export default combineReducers<AddProductState, RootAction>({
    slider: (state = null, action) => {
        switch (action.type) {
            case getType(actions.init): {
                const { product, startVolume } = action.payload;

                let selectedServing = product.defaultServing;
                if (startVolume) {
                    selectedServing =
                        _(Object.keys(product.servings))
                            .filter((x) => startVolume % product.servings[x] === 0)
                            .orderBy((x) => product.servings[x], 'desc')
                            .first() || selectedServing;
                }

                const curve = selectScale(selectedServing, product.servings[selectedServing], product.nutritionalInfo);
                let volume = curve.labelStep;
                if (startVolume) {
                    volume = startVolume - (startVolume % curve.step);
                    volume = volume / product.servings[selectedServing];
                }

                return { curve, volume, product, selectedServing };
            }
            case getType(actions.setVolume):
                return state && { ...state, volume: action.payload };
            case getType(actions.setServing): {
                if (state === null) return null;

                const curve = selectScale(
                    action.payload,
                    state.product.servings[action.payload],
                    state.product.nutritionalInfo,
                );
                return { ...state, selectedServing: action.payload, curve, volume: curve.labelStep };
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

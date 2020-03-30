import { ConsumedProduct, ConsumptionTime, FrequentlyUsedProducts, ProductSearchDto } from 'Models';
import { RootAction } from 'MyNutritionComrade';
import { getType } from 'typesafe-actions';
import * as actions from './actions';
import { patchConsumedProducts } from './utils';

export type ConsumeProductData = {
    date: string;
    time: ConsumptionTime;
    product: ProductSearchDto;
    value: number;

    requestId: string;
    append: boolean;
};

export type DiaryState = Readonly<{
    /** the current date that is displayed */
    currentDate: string;

    /** the consumed products of the current date */
    consumedProducts: ConsumedProduct[];

    /** pending products for which the server hasn't respond yet */
    pendingConsumedProducts: ConsumeProductData[];

    /** frequently used products received once at the start */
    frequentlyUsedProducts: FrequentlyUsedProducts;
}>;

export const initialState: DiaryState = {
    currentDate: '',
    consumedProducts: [],
    pendingConsumedProducts: [],
    frequentlyUsedProducts: { breakfast: [], lunch: [], dinner: [], snack: [] },
};

export default function (state: DiaryState = initialState, action: RootAction): DiaryState {
    switch (action.type) {
        case getType(actions.loadFrequentlyUsedProducts.success):
            return { ...state, frequentlyUsedProducts: action.payload };
        case getType(actions.loadDate.request):
            return { ...state, currentDate: action.payload };
        case getType(actions.loadDate.success):
            if (state.currentDate !== action.payload.date) return state;
            return { ...state, consumedProducts: action.payload.value, pendingConsumedProducts: [] };
        case getType(actions.changeProductConsumption.request):
            return {
                ...state,
                pendingConsumedProducts: [...state.pendingConsumedProducts, action.payload],
            };
        case getType(actions.changeProductConsumption.success):
            const pending = state.pendingConsumedProducts.filter((x) => x.requestId === action.payload.requestId);
            if (!pending) return state; // likely changed current date

            return {
                ...state,
                consumedProducts: patchConsumedProducts(state.consumedProducts, action.payload),
                pendingConsumedProducts: state.pendingConsumedProducts.filter(
                    (x) => x.requestId !== action.payload.requestId,
                ),
            };
        default:
            return state;
    }
}

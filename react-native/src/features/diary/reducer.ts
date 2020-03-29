import { ConsumedProduct, FrequentlyUsedProducts, ConsumptionTime, ProductSearchDto } from 'Models';
import { RootAction } from 'MyNutritionComrade';
import { changeVolume } from 'src/utils/nutrition-info-helper';
import { getType } from 'typesafe-actions';
import * as actions from './actions';

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

export const matchProduct = (o1: ConsumedProduct, o2: ConsumeProductData) =>
    o1.day === o2.date && o1.time === o2.time && o1.productId === o2.product.id;

const mapToProduct = (x: ConsumeProductData, newValue?: number) => ({
    day: x.date,
    time: x.time,
    productId: x.product.id,
    label: x.product.label,
    nutritionInformation: changeVolume(x.product.nutritionInformation, newValue ?? x.value),
    tags: x.product.tags,
});

const initialState: DiaryState = {
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
            return { ...state, currentDate: action.payload, consumedProducts: [], pendingConsumedProducts: [] };
        case getType(actions.changeProductConsumption.request):
            return {
                ...state,
                pendingConsumedProducts: [...state.pendingConsumedProducts, action.payload],
            };
        case getType(actions.changeProductConsumption.success):
            const pending = state.pendingConsumedProducts.filter((x) => x.requestId === action.payload.requestId);
            if (!pending) return state; // likely changed current date

            let newConsumedProducts = state.consumedProducts;
            if (action.payload.value === 0) {
                if (!action.payload.append) {
                    // remove item
                    newConsumedProducts = newConsumedProducts.filter((x) => !matchProduct(x, action.payload));
                }
            } else if (newConsumedProducts.findIndex((x) => matchProduct(x, action.payload)) > -1) {
                const newValue = action.payload.append
                    ? (state.consumedProducts.find((x) => matchProduct(x, action.payload))?.nutritionInformation
                          .volume ?? 0) + action.payload.value
                    : action.payload.value;

                // update item
                newConsumedProducts = newConsumedProducts.map((x) =>
                    matchProduct(x, action.payload)
                        ? { ...x, nutritionInformation: changeVolume(x.nutritionInformation, newValue) }
                        : x,
                );
            } else {
                // add item
                newConsumedProducts = [...newConsumedProducts, mapToProduct(action.payload)];
            }

            return {
                ...state,
                consumedProducts: newConsumedProducts,
                pendingConsumedProducts: state.pendingConsumedProducts.filter(
                    (x) => x.requestId !== action.payload.requestId,
                ),
            };
        default:
            return state;
    }
}

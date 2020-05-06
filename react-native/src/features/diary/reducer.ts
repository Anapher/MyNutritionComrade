import { DateTime } from 'luxon';
import {
    ConsumedProduct,
    ConsumptionTime,
    FrequentlyUsedProducts,
    ProductConsumptionDates,
    ProductEssentialsWithId,
    ComputedNutritionGoals,
} from 'Models';
import { RootAction } from 'MyNutritionComrade';
import { getType } from 'typesafe-actions';
import * as actions from './actions';
import { getRequiredDates, patchConsumedProducts } from './utils';

export type ConsumeProductData = {
    date: string;
    time: ConsumptionTime;
    product: ProductEssentialsWithId;
    value: number;

    requestId: string;
    append: boolean;
};

export type DiaryConsumedDate = {
    date: string;
    products: ConsumedProduct[];
};

export type DiaryState = Readonly<{
    /** the current date that is displayed */
    selectedDate: string;

    /** all loaded days of consumed products */
    loadedDays: ProductConsumptionDates;

    /** pending products for which the server hasn't respond yet */
    pendingConsumedProducts: ConsumeProductData[];

    /** frequently used products received once at the start */
    frequentlyUsedProducts: FrequentlyUsedProducts;

    nutritionGoal: ComputedNutritionGoals | null;
    nutritionGoalTimestamp: string | null;
}>;

export const initialState: DiaryState = {
    selectedDate: '',
    loadedDays: {},
    pendingConsumedProducts: [],
    frequentlyUsedProducts: { breakfast: [], lunch: [], dinner: [], snack: [] },
    nutritionGoal: null,
    nutritionGoalTimestamp: null,
};

export default function (state: DiaryState = initialState, action: RootAction): DiaryState {
    switch (action.type) {
        case getType(actions.loadFrequentlyUsedProducts.success):
            return { ...state, frequentlyUsedProducts: action.payload };
        case getType(actions.setSelectedDate.request):
            return { ...state, selectedDate: action.payload };
        case getType(actions.setSelectedDate.success):
            if (state.selectedDate !== action.payload.date) return state;

            const requiredDays = getRequiredDates(
                DateTime.local(),
                DateTime.fromISO(state.selectedDate),
                3,
                7,
            ).map((x) => x.toISODate());
            const merged = { ...state.loadedDays, ...action.payload.data };

            return {
                ...state,
                loadedDays: Object.fromEntries(
                    Object.keys(merged)
                        .filter((x) => requiredDays.includes(x))
                        .map((x) => [x, merged[x]]),
                ),
            };
        case getType(actions.changeProductConsumption.request):
            return {
                ...state,
                pendingConsumedProducts: [...state.pendingConsumedProducts, action.payload],
            };
        case getType(actions.changeProductConsumption.success):
            const pending = state.pendingConsumedProducts.find((x) => x.requestId === action.payload.requestId);
            if (!pending) return state;

            const date = DateTime.fromISO(action.payload.date).toISODate();
            const consumedProducts = state.loadedDays[date];
            if (consumedProducts === undefined) return state;

            return {
                ...state,
                loadedDays: Object.fromEntries(
                    Object.keys(state.loadedDays).map((x) => [
                        x,
                        x === date ? patchConsumedProducts(consumedProducts, action.payload) : state.loadedDays[x],
                    ]),
                ),
                pendingConsumedProducts: state.pendingConsumedProducts.filter(
                    (x) => x.requestId !== action.payload.requestId,
                ),
            };
        case getType(actions.changeProductConsumption.failure):
            return {
                ...state,
                pendingConsumedProducts: state.pendingConsumedProducts.filter(
                    (x) => x.requestId === action.payload.requestId,
                ),
            };
        case getType(actions.loadNutritionGoal.success):
            return { ...state, nutritionGoal: action.payload, nutritionGoalTimestamp: DateTime.local().toISO() };
        default:
            return state;
    }
}

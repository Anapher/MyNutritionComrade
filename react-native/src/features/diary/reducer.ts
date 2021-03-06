import { DateTime } from 'luxon';
import {
    ComputedNutritionGoals,
    ConsumedDto,
    ConsumptionTime,
    FoodPortionCreationDto,
    FoodPortionDto,
    FrequentlyConsumed,
    ProductConsumptionDates,
} from 'Models';
import { RootAction } from 'MyNutritionComrade';
import { getType } from 'typesafe-actions';
import * as actions from './actions';
import { getRequiredDates, patchConsumedProducts as patchConsumedList } from './utils';

export type CreateConsumptionRequest = {
    date: string;
    time: ConsumptionTime;
    creationDto: FoodPortionCreationDto;

    foodPortion?: FoodPortionDto;

    requestId: string;
    append: boolean;
};

export type DeleteConsumptionRequest = {
    date: string;
    time: ConsumptionTime;

    delete: true;

    foodPortionId: string;
    requestId: string;
};

export type ConsumptionAction = CreateConsumptionRequest | DeleteConsumptionRequest;

export type DiaryConsumedDate = {
    date: string;
    products: ConsumedDto[];
};

export type DiaryState = Readonly<{
    /** the current date that is displayed */
    selectedDate: string;

    /** all loaded days of consumed products */
    loadedDays: ProductConsumptionDates;

    /** pending products for which the server hasn't responded yet */
    pendingActions: ConsumptionAction[];

    /** frequently used products received once at the start */
    frequentlyUsedProducts: FrequentlyConsumed;

    nutritionGoal: ComputedNutritionGoals | null;
    nutritionGoalTimestamp: string | null;
}>;

export const initialState: DiaryState = {
    selectedDate: '',
    loadedDays: {},
    pendingActions: [],
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
        case getType(actions.patchConsumptions.request):
            return { ...state, pendingActions: [...state.pendingActions, action.payload] };
        case getType(actions.patchConsumptions.success):
            const pending = state.pendingActions.find((x) => x.requestId === action.payload.trigger.requestId);
            if (!pending) return state;

            const date = DateTime.fromISO(action.payload.trigger.date).toISODate();
            const consumedProducts = state.loadedDays[date];
            if (consumedProducts === undefined) {
                return state;
            }

            return {
                ...state,
                loadedDays: Object.fromEntries(
                    Object.keys(state.loadedDays).map((x) => [
                        x,
                        x === date
                            ? patchConsumedList(consumedProducts, action.payload.trigger, action.payload.dto)
                            : state.loadedDays[x],
                    ]),
                ),
                pendingActions: state.pendingActions.filter((x) => x.requestId !== action.payload.trigger.requestId),
            };
        case getType(actions.patchConsumptions.failure):
            return {
                ...state,
                pendingActions: state.pendingActions.filter((x) => x.requestId === action.payload.requestId),
            };
        case getType(actions.loadNutritionGoal.success):
            return { ...state, nutritionGoal: action.payload, nutritionGoalTimestamp: DateTime.local().toISO() };
        default:
            return state;
    }
}

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FoodPortion, FoodPortionItem, FoodPortionProduct } from 'src/types';
import { foodPortionsEqual, getFoodPortionId } from 'src/utils/food-portion-utils';
import { MealForm } from './validation';

export type MealCreateState = {
   items: FoodPortionItem[];
   name: string;
};

const initialState: MealCreateState = { items: [], name: '' };

const mealCreateSlice = createSlice({
   name: 'meal-create',
   initialState,
   reducers: {
      initialize(state, { payload }: PayloadAction<Partial<MealForm>>) {
         state.name = payload.name ?? '';
         state.items = payload.items ?? [];
      },
      setName(state, { payload }: PayloadAction<string>) {
         state.name = payload;
      },
      addItem(state, { payload: { foodPortion } }: PayloadAction<{ foodPortion: FoodPortion }>) {
         if (foodPortion.type === 'custom' || foodPortion.type === 'product') {
            state.items.push(foodPortion);
         } else if (foodPortion.type === 'meal') {
            state.items.push(...foodPortion.items);
         }
      },
      setItem(state, { payload: { foodPortion } }: PayloadAction<{ foodPortion: FoodPortionItem }>) {
         state.items = [...state.items.filter((item) => !foodPortionsEqual(item, foodPortion)), foodPortion];
      },
      changeProductAmount(
         state,
         {
            payload: { foodPortion, amount, servingType },
         }: PayloadAction<{ foodPortion: FoodPortionProduct; amount: number; servingType: string }>,
      ) {
         state.items = state.items.map((item) =>
            foodPortionsEqual(item, foodPortion) ? { ...foodPortion, amount, servingType } : item,
         );
      },
      removeItem(state, { payload }: PayloadAction<string>) {
         state.items = state.items.filter((item) => getFoodPortionId(item) !== payload);
      },
   },
});

export const { initialize, setName, addItem, setItem, changeProductAmount, removeItem } = mealCreateSlice.actions;

export default mealCreateSlice.reducer;

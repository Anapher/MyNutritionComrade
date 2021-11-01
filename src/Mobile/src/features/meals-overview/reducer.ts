import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Meal } from 'src/types';

export type MealsOverviewState = {
   meals: Meal[] | null;
};

const initialState: MealsOverviewState = {
   meals: null,
};

const mealsOverviewSlice = createSlice({
   name: 'meals-overview',
   initialState,
   reducers: {
      mealsLoaded(state, { payload }: PayloadAction<Meal[]>) {
         state.meals = payload;
      },
   },
});

export const { mealsLoaded } = mealsOverviewSlice.actions;

export default mealsOverviewSlice.reducer;

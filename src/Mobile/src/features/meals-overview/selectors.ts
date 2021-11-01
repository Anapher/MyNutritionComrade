import { RootState } from 'src/store';

export const selectMeals = (state: RootState) => state.mealsOverview.meals;

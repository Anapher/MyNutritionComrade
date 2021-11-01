import { createAction } from '@reduxjs/toolkit';
import { Meal } from 'src/types';

export const createMeal = createAction<Omit<Meal, 'id'>>('meal-create/create');
export const changeMeal = createAction<Meal>('meal-create/change');

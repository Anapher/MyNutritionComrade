import { Meal, Product } from 'src/types';
import { createAction } from '@reduxjs/toolkit';
import { ProductSearchCompletedAction } from 'src/RootNavigator';

export type SelectedProductAmountPayload = {
   amount: number;
   servingType: string;
   product: Product;
   completedAction: ProductSearchCompletedAction;
};

export const selectedProductAmount = createAction<SelectedProductAmountPayload>(
   `product-search/selected-product-amount`,
);

export type SelectedMealPortionPayload = {
   portion: number;
   meal: Meal;
   completedAction: ProductSearchCompletedAction;
};

export const selectedMealPortion = createAction<SelectedMealPortionPayload>(`product-search/selected-meal-portion`);

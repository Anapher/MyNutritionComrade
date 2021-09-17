import { Product } from 'src/types';
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

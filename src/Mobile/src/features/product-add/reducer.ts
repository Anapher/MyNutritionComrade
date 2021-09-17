import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from 'src/types';
import { CurveScale, selectScale, selectServingType } from './utils';

export type InitializeProductAddPayload = {
   product: Product;
   amount?: number;
   servingType?: string;
};

export type ProductSlider = {
   amount: number;
   servingType: string;
   product: Product;
   curve: CurveScale;
};

export type ProductAddState = {
   slider: ProductSlider | null;
};

const initialState: ProductAddState = {
   slider: null,
};

const productAddSlice = createSlice({
   name: 'product-add',
   initialState,
   reducers: {
      initialize(state, { payload: { product, amount, servingType } }: PayloadAction<InitializeProductAddPayload>) {
         const selectedServingType = selectServingType(product, amount, servingType);
         const curve = selectScale(product.servings[selectedServingType], product.nutritionalInfo);

         let selectedAmount = curve.labelStep;
         if (amount) {
            selectedAmount = amount - (amount % curve.step);
         }

         state.slider = { curve, amount: selectedAmount, product, servingType: selectedServingType };
      },
      setAmount(state, { payload }: PayloadAction<number>) {
         if (state.slider) {
            state.slider.amount = payload;
         }
      },
      setServingType(state, { payload }: PayloadAction<string>) {
         if (state.slider) {
            const curve = selectScale(state.slider.product.servings[payload], state.slider.product.nutritionalInfo);
            state.slider.servingType = payload;
            state.slider.curve = curve;
            state.slider.amount = curve.labelStep;
         }
      },
   },
});

export const { initialize, setAmount, setServingType } = productAddSlice.actions;

export default productAddSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ProductCreateState = {
   mode: 'create' | 'change' | null;
};

const initialState: ProductCreateState = {
   mode: null,
};

const productAddSlice = createSlice({
   name: 'product-create',
   initialState,
   reducers: {
      initialize(state, { payload: { mode } }: PayloadAction<{ mode: 'create' | 'change' }>) {
         state.mode = mode;
      },
   },
});

export const { initialize } = productAddSlice.actions;

export default productAddSlice.reducer;

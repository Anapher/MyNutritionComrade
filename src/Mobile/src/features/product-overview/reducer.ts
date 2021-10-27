import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductContributionStatusDto } from 'src/types';

export type InitializeProductOverviewPayload = {
   product: Product;
   contributionStatus?: ProductContributionStatusDto | null;
};

export type ProductOverviewState = {
   product: Product | null;
   contributionStatus: ProductContributionStatusDto | null;
   loading: boolean;
};

const initialState: ProductOverviewState = {
   product: null,
   contributionStatus: null,
   loading: false,
};

const productOverviewSlice = createSlice({
   name: 'product-overview',
   initialState,
   reducers: {
      initialize(state, { payload: { product, contributionStatus } }: PayloadAction<InitializeProductOverviewPayload>) {
         state.product = product;
         state.contributionStatus = contributionStatus ?? null;
         state.loading = false;
      },
      beginLoadingContributionStatus(state) {
         state.loading = true;
      },
      contributionStatusLoaded(
         state,
         { payload: { dto, productId } }: PayloadAction<{ dto: ProductContributionStatusDto; productId: string }>,
      ) {
         if (state.product?.id !== productId) {
            return;
         }

         state.contributionStatus = dto;
         state.loading = false;
      },
      uninitialize(state) {
         state.product = null;
         state.loading = false;
         state.contributionStatus = null;
      },
   },
});

export const { initialize, beginLoadingContributionStatus, contributionStatusLoaded, uninitialize } =
   productOverviewSlice.actions;

export default productOverviewSlice.reducer;

import { RootState } from 'src/store';

export const selectCurrentProduct = (state: RootState) => state.productOverview.product;
export const selectProductContributionStatus = (state: RootState) => state.productOverview.contributionStatus;
export const selectLoading = (state: RootState) => state.productOverview.loading;

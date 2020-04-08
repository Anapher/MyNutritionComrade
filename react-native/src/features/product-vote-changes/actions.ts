import { ProductContributionDto, ProductInfo } from 'Models';
import { RequestErrorResponse } from 'src/utils/error-result';
import { createAction, createAsyncAction } from 'typesafe-actions';

export const init = createAction('PRODUCTVOTECHANGES/INIT')<{
    contributions: ProductContributionDto[];
    product: ProductInfo;
}>();

export const voteContribution = createAsyncAction(
    'PRODUCTVOTECHANGES/VOTE_CONTRIBUTION_REQUEST',
    'PRODUCTVOTECHANGES/VOTE_CONTRIBUTION_SUCCESS',
    'PRODUCTVOTECHANGES/VOTE_CONTRIBUTION_FAILURE',
)<
    { productContributionId: string; approve: boolean },
    ProductContributionDto,
    { productContributionId: string; error: RequestErrorResponse }
>();

import { ProductContributionDto, ProductInfo, ProductContributionStatus } from 'Models';
import { RequestErrorResponse } from 'src/utils/error-result';
import { createAction, createAsyncAction } from 'typesafe-actions';
import { PagingResponse } from 'MyNutritionComrade';

export const init = createAction('PRODUCTVOTECHANGES/INIT')<ProductInfo>();

export const loadContributions = createAsyncAction(
    'PRODUCTVOTECHANGES/LOAD_CONTRIBUTIONS_REQUEST',
    'PRODUCTVOTECHANGES/LOAD_CONTRIBUTIONS_SUCCESS',
    'PRODUCTVOTECHANGES/LOAD_CONTRIBUTIONS_FAILURE',
)<
    { productId: string; filter?: ProductContributionStatus },
    { response: PagingResponse<ProductContributionDto>; filter?: ProductContributionStatus; productId: string },
    { productId: string; error: RequestErrorResponse }
>();

export const loadNextContributions = createAsyncAction(
    'PRODUCTVOTECHANGES/LOAD_NEXT_CONTRIBUTIONS_REQUEST',
    'PRODUCTVOTECHANGES/LOAD_NEXT_CONTRIBUTIONS_SUCCESS',
    'PRODUCTVOTECHANGES/LOAD_NEXT_CONTRIBUTIONS_FAILURE',
)<undefined, PagingResponse<ProductContributionDto>, RequestErrorResponse>();

export const voteContribution = createAsyncAction(
    'PRODUCTVOTECHANGES/VOTE_CONTRIBUTION_REQUEST',
    'PRODUCTVOTECHANGES/VOTE_CONTRIBUTION_SUCCESS',
    'PRODUCTVOTECHANGES/VOTE_CONTRIBUTION_FAILURE',
)<
    { productContributionId: string; approve: boolean },
    ProductContributionDto,
    { productContributionId: string; error: RequestErrorResponse }
>();

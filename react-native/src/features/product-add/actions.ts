import { ProductContributionDto, ProductInfo } from 'Models';
import { createAsyncAction, createAction } from 'typesafe-actions';
import { RequestErrorResponse } from 'src/utils/error-result';
import { PagingResponse } from 'MyNutritionComrade';

export const init = createAction('PRODUCTADD/INIT')<{ product: ProductInfo; amount?: number; servingType?: string }>();
export const setAmount = createAction('PRODUCTADD/SET_AMOUNT')<number>();
export const setServing = createAction('PRODUCTADD/SET_SERVING')<string>();

export const loadContributionsAsync = createAsyncAction(
    'PRODUCTADD/LOAD_CONTRIBUTIONS_REQUEST',
    'PRODUCTADD/LOAD_CONTRIBUTIONS_SUCCESS',
    'PRODUCTADD/LOAD_CONTRIBUTIONS_FAILURE',
)<string, PagingResponse<ProductContributionDto>, RequestErrorResponse>();

import { ProductContributionDto, ProductInfo } from 'Models';
import { createAsyncAction, createAction } from 'typesafe-actions';
import { RequestErrorResponse } from 'src/utils/error-result';

export const init = createAction('PRODUCTADD/INIT')<{ product: ProductInfo; startVolume?: number }>();
export const setVolume = createAction('PRODUCTADD/SET_VOLUME')<number>();
export const setServing = createAction('PRODUCTADD/SET_SERVING')<string>();

export const loadContributionsAsync = createAsyncAction(
    'PRODUCTADD/LOAD_CONTRIBUTIONS_REQUEST',
    'PRODUCTADD/LOAD_CONTRIBUTIONS_SUCCESS',
    'PRODUCTADD/LOAD_CONTRIBUTIONS_FAILURE',
)<string, ProductContributionDto[], RequestErrorResponse>();

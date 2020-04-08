import cuid from 'cuid';
import { ConsumedProduct, FrequentlyUsedProducts } from 'Models';
import { RequestErrorResponse } from 'src/utils/error-result';
import { createAction, createAsyncAction } from 'typesafe-actions';
import { ConsumeProductData } from './reducer';

export const loadFrequentlyUsedProducts = createAsyncAction(
    'DIARY/LOAD_FREQUENTLYUSEDPRODUCTS_REQUEST',
    'DIARY/LOAD_FREQUENTLYUSEDPRODUCTS_SUCCESS',
    'DIARY/LOAD_FREQUENTLYUSEDPRODUCTS_FAILURE',
)<undefined, FrequentlyUsedProducts, RequestErrorResponse>();

export const loadDate = createAsyncAction(
    'DIARY/LOAD_DATE_REQUEST',
    'DIARY/LOAD_DATE_SUCCESS',
    'DIARY/LOAD_DATE_FAILURE',
)<string, { date: string; value: ConsumedProduct[] }, RequestErrorResponse>();

export const changeProductConsumption = {
    request: createAction(
        'DIARY/CHANGE_PRODUCT_CONSUMPTION_REQUEST',
        (payload: Omit<ConsumeProductData, 'requestId'>) => ({ ...payload, requestId: cuid() }),
    )(),
    success: createAction('DIARY/CHANGE_PRODUCT_CONSUMPTION_SUCCESS')<ConsumeProductData>(),
    failure: createAction('DIARY/CHANGE_PRODUCT_CONSUMPTION_FAILURE')<RequestErrorResponse & { requestId: string }>(),
};

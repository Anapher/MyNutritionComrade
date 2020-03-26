import { FrequentlyUsedProducts } from 'Models';
import { RequestErrorResponse } from 'src/utils/error-result';
import { createAsyncAction } from 'typesafe-actions';

export const loadFrequentlyUsedProducts = createAsyncAction(
    'DIARY/LOAD_FREQUENTLYUSEDPRODUCTS_REQUEST',
    'DIARY/LOAD_FREQUENTLYUSEDPRODUCTS_SUCCESS',
    'DIARY/LOAD_FREQUENTLYUSEDPRODUCTS_FAILURE',
)<never, FrequentlyUsedProducts, RequestErrorResponse>();

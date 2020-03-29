import { FrequentlyUsedProducts, ConsumedProduct, ConsumptionTime, ProductSearchDto } from 'Models';
import { RequestErrorResponse } from 'src/utils/error-result';
import { createAsyncAction, createAction } from 'typesafe-actions';
import cuid from 'cuid';
import { createStandardAction } from 'typesafe-actions/dist/deprecated/create-standard-action';
import { withTheme } from 'react-native-paper';
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
    request: createStandardAction(
        'DIARY/CHANGE_PRODUCT_CONSUMPTION_REQUEST',
    ).map((payload: Omit<ConsumeProductData, 'requestId'>) => ({ payload: { ...payload, requestId: cuid() } })),
    success: createStandardAction('DIARY/CHANGE_PRODUCT_CONSUMPTION_SUCCESS')<ConsumeProductData>(),
    failure: createStandardAction('DIARY/CHANGE_PRODUCT_CONSUMPTION_FAILURE')<
        RequestErrorResponse & { requestId: string }
    >(),
};

withTheme;

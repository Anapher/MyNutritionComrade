import { createAsyncAction, createAction } from 'typesafe-actions';
import { RequestErrorResponse } from 'src/utils/error-result';
import { ProductInfo, Product } from 'Models';

export const createAsync = createAsyncAction(
    'PRODUCTCREATE/CREATE_REQUEST',
    'PRODUCTCREATE/CREATE_SUCCESS',
    'PRODUCTCREATE/CREATE_FAILURE',
)<ProductInfo, Product, RequestErrorResponse>();

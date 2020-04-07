import { createAsyncAction, createAction } from 'typesafe-actions';
import { RequestErrorResponse } from 'src/utils/error-result';
import { ProductInfo, Product, PatchOperation } from 'Models';

export const createAsync = createAsyncAction(
    'PRODUCTCREATE/CREATE_REQUEST',
    'PRODUCTCREATE/CREATE_SUCCESS',
    'PRODUCTCREATE/CREATE_FAILURE',
)<ProductInfo, Product, RequestErrorResponse>();

export const updateAsync = createAsyncAction(
    'PRODUCTCREATE/UPDATE_REQUEST',
    'PRODUCTCREATE/UPDATE_SUCCESS',
    'PRODUCTCREATE/UPDATE_FAILURE',
)<{ productId: string; patch: PatchOperation[] }, any, RequestErrorResponse>();

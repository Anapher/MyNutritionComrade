import { PatchOperation, Product, ProductProperties } from 'Models';
import { RequestErrorResponse } from 'src/utils/error-result';
import { createAsyncAction } from 'typesafe-actions';

export const createAsync = createAsyncAction(
    'PRODUCTCREATE/CREATE_REQUEST',
    'PRODUCTCREATE/CREATE_SUCCESS',
    'PRODUCTCREATE/CREATE_FAILURE',
)<ProductProperties, Product, RequestErrorResponse>();

export const updateAsync = createAsyncAction(
    'PRODUCTCREATE/UPDATE_REQUEST',
    'PRODUCTCREATE/UPDATE_SUCCESS',
    'PRODUCTCREATE/UPDATE_FAILURE',
)<{ productId: string; patch: PatchOperation[] }, any, RequestErrorResponse>();

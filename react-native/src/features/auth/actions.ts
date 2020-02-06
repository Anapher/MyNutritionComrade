import { createAsyncAction, createAction } from 'typesafe-actions';
import { RequestErrorResponse } from 'src/utils/error-result';
import { AccessInfo, SignInRequest } from 'AppModels';

export const signInAsync = createAsyncAction('AUTH/SIGNIN_REQUEST', 'AUTH/SIGNIN_SUCCESS', 'AUTH/SIGNIN_FAILURE')<
    SignInRequest,
    AccessInfo,
    RequestErrorResponse
>();

export const refreshTokenAsync = createAsyncAction(
    'AUTH/REFRESH_TOKEN_REQUEST',
    'AUTH/REFRESH_TOKEN_SUCCESS',
    'AUTH/REFRESH_TOKEN_FAILURE',
)<AccessInfo, AccessInfo, RequestErrorResponse>();

export const signOut = createAction('AUTH/SIGNOUT')();

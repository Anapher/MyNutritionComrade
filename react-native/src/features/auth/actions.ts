import { createAsyncAction, createAction } from 'typesafe-actions';
import { RequestErrorResponse } from 'src/utils/error-result';
import { AccessInfo } from 'AppModels';

export const googleSignInAsync = {
    request: createAction('AUTH/GOOGLE_SIGNIN_REQUEST')<undefined>(),
    failure: createAction('AUTH/GOOGLE_SIGNIN_FAILURE')<RequestErrorResponse>(),
};

export const refreshTokenAsync = createAsyncAction(
    'AUTH/REFRESH_TOKEN_REQUEST',
    'AUTH/REFRESH_TOKEN_SUCCESS',
    'AUTH/REFRESH_TOKEN_FAILURE',
)<AccessInfo, AccessInfo, RequestErrorResponse>();

export const signOut = createAction('AUTH/SIGNOUT')();
export const signedIn = createAction('AUTH/SIGN_IN_SUCCESS')<AccessInfo>();

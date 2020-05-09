import { combineReducers } from 'redux';
import { RootAction } from 'MyNutritionComrade';
import { AccessInfo } from 'AppModels';
import * as actions from './actions';
import { getType } from 'typesafe-actions';

export type AuthenticationState = Readonly<{
    token: AccessInfo | null;
    isSigningIn: boolean;
}>;

export default combineReducers<AuthenticationState, RootAction>({
    token: (state = null, action) => {
        switch (action.type) {
            case getType(actions.signedIn):
                return action.payload;
            case getType(actions.signOut):
                return null;
            case getType(actions.refreshTokenAsync.success):
                return action.payload;
            default:
                return state;
        }
    },
    isSigningIn: (state = false, action) => {
        switch (action.type) {
            case getType(actions.googleSignInAsync.request):
                return true;
            case getType(actions.googleSignInAsync.failure):
            case getType(actions.signedIn):
                return false;
            default:
                return state;
        }
    },
});

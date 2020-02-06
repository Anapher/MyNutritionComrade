import { combineReducers } from 'redux';
import { RootAction } from 'MyNutritionComrade';
import { AccessInfo } from 'AppModels';
import * as actions from './actions';
import { getType } from 'typesafe-actions';

export type AuthenticationState = Readonly<{
    isAuthenticated: boolean;
    isSignOut: boolean;
    rememberMe: boolean;
    token: AccessInfo | null;
}>;

export default combineReducers<AuthenticationState, RootAction>({
    isAuthenticated: (state = false, action) => {
        switch (action.type) {
            case getType(actions.signInAsync.success):
                return true;
            case getType(actions.signOut):
                return false;
            default:
                return state;
        }
    },
    isSignOut: (state = false, action) => {
        switch (action.type) {
            case getType(actions.signOut):
                return true;
            case getType(actions.signInAsync.success):
                return false;
            default:
                return state;
        }
    },
    rememberMe: (state = false, action) => {
        switch (action.type) {
            case getType(actions.signInAsync.request):
                return action.payload.rememberMe;
            default:
                return state;
        }
    },
    token: (state = null, action) => {
        switch (action.type) {
            case getType(actions.signInAsync.success):
                return action.payload;
            case getType(actions.signOut):
                return null;
            case getType(actions.refreshTokenAsync.success):
                return action.payload;
            default:
                return state;
        }
    },
});

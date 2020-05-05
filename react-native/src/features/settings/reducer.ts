import { UserSettings } from 'Models';
import { RootAction } from 'MyNutritionComrade';
import { combineReducers } from 'redux';
import { RequestErrorResponse } from 'src/utils/error-result';
import { getType } from 'typesafe-actions';
import * as actions from './actions';

export type SettingsState = Readonly<{
    userSettings: UserSettings | null;
    isLoading: boolean;
    error: RequestErrorResponse | null;
}>;

export default combineReducers<SettingsState, RootAction>({
    userSettings: (state = null, action) => {
        switch (action.type) {
            case getType(actions.loadUserSettings.success):
                return action.payload;
            case getType(actions.patchUserSettings.success):
                return action.payload;
        }
        return state;
    },
    isLoading: (state = false, action) => {
        switch (action.type) {
            case getType(actions.loadUserSettings.success):
            case getType(actions.loadUserSettings.failure):
                return false;
            case getType(actions.loadUserSettings.request):
                return true;
        }
        return state;
    },
    error: (state = null, action) => {
        switch (action.type) {
            case getType(actions.loadUserSettings.failure):
                return action.payload;
            case getType(actions.loadUserSettings.success):
                return null;
        }
        return state;
    },
});

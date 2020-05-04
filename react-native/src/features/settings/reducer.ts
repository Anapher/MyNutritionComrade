import { UserNutritionGoal, UserPersonalInfo } from 'Models';
import { RootAction } from 'MyNutritionComrade';
import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import * as actions from './actions';
import { RequestErrorResponse } from 'src/utils/error-result';

export type SettingsState = Readonly<{
    nutritionGoal: UserNutritionGoal | null;
    isLoadingNutritionGoal: boolean;
    errorNutritionGoal: RequestErrorResponse | null;

    personalInfo: UserPersonalInfo | null;
    isLoadingPersonalInfo: boolean;
    errorPersonalInfo: RequestErrorResponse | null;
}>;

export default combineReducers<SettingsState, RootAction>({
    nutritionGoal: (state = null, action) => {
        switch (action.type) {
            case getType(actions.loadCurrentNutritionGoal.success):
                return action.payload;
            case getType(actions.patchNutritionGoal.success):
                return action.payload;
        }
        return state;
    },
    isLoadingNutritionGoal: (state = false, action) => {
        switch (action.type) {
            case getType(actions.loadCurrentNutritionGoal.success):
            case getType(actions.loadCurrentNutritionGoal.failure):
                return false;
            case getType(actions.loadCurrentNutritionGoal.request):
                return true;
        }
        return state;
    },
    errorNutritionGoal: (state = null, action) => {
        switch (action.type) {
            case getType(actions.loadCurrentNutritionGoal.failure):
                return action.payload;
            case getType(actions.loadCurrentNutritionGoal.success):
                return null;
        }
        return state;
    },
    personalInfo: (state = null, action) => {
        switch (action.type) {
            case getType(actions.loadPersonalInfo.success):
                return action.payload;
            case getType(actions.patchPersonalInfo.success):
                return action.payload;
        }
        return state;
    },
    isLoadingPersonalInfo: (state = false, action) => {
        switch (action.type) {
            case getType(actions.loadPersonalInfo.success):
            case getType(actions.loadPersonalInfo.failure):
                return false;
            case getType(actions.loadPersonalInfo.request):
                return true;
        }
        return state;
    },
    errorPersonalInfo: (state = null, action) => {
        switch (action.type) {
            case getType(actions.loadPersonalInfo.failure):
                return action.payload;
            case getType(actions.loadPersonalInfo.success):
                return null;
        }
        return state;
    },
});

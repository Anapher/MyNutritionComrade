import { LoggedWeight } from 'Models';
import { RootAction } from 'MyNutritionComrade';
import { combineReducers } from 'redux';
import { RequestErrorResponse } from 'src/utils/error-result';
import { getType } from 'typesafe-actions';
import * as actions from './actions';

export type LogWeightState = Readonly<{
    isLoading: boolean;
    loggedWeights: LoggedWeight[] | null;
    total: number;
    nextLink: string | null;
    error: RequestErrorResponse | null;
}>;

export default combineReducers<LogWeightState, RootAction>({
    isLoading: (state = false, action) => {
        switch (action.type) {
            case getType(actions.loadLoggedWeight.request):
                return true;
            case getType(actions.loadLoggedWeight.failure):
            case getType(actions.loadLoggedWeight.success):
                return false;
            default:
                return state;
        }
    },
    total: (state = 0, action) => {
        switch (action.type) {
            case getType(actions.loadLoggedWeight.success):
                return action.payload.meta.totalRecords;
            default:
                return state;
        }
    },
    loggedWeights: (state = null, action) => {
        switch (action.type) {
            case getType(actions.loadLoggedWeight.success):
                if (!state) return action.payload.data;

                return [...state, ...action.payload.data];
            case getType(actions.addLoggedWeight.success):
                return [action.payload, ...state];
            case getType(actions.removeLoggedWeight.request):
                return state && state.filter((x) => x.timestamp !== action.payload);
            default:
                return state;
        }
    },
    nextLink: (state = null, action) => {
        switch (action.type) {
            case getType(actions.loadLoggedWeight.success):
                return action.payload.links.next;
            default:
                return state;
        }
    },
    error: (state = null, action) => {
        switch (action.type) {
            case getType(actions.loadLoggedWeight.failure):
                return action.payload;
            case getType(actions.loadLoggedWeight.success):
                return null;
            default:
                return state;
        }
    },
});

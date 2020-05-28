import { createAction, getType } from 'typesafe-actions';
import { RootState, RootAction } from 'MyNutritionComrade';
import { Reducer } from 'redux';

export const purgeState = createAction('ROOT/PURGE')();

const purgableReducer: (appReducer: Reducer<RootState, RootAction>) => Reducer<RootState, RootAction> = ((
    appReducer: Reducer<RootState, RootAction>,
) => (state: RootState, action: RootAction) => {
    return appReducer(getType(purgeState) === action.type ? (undefined as any) : state, action);
}) as any;

export default purgableReducer;

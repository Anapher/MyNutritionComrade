import { RootAction } from 'MyNutritionComrade';
import { combineReducers } from 'redux';

export type AuthenticationState = Readonly<{
    isLoadingStorage: boolean;
    // theme: string;
}>;

export default combineReducers<AuthenticationState, RootAction>({
    isLoadingStorage: (state = false, action) => {
        return state;
    },
});

import { RootAction, RootState, Services } from 'MyNutritionComrade';
import { applyMiddleware, createStore, compose, Store } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import services from '../services';
import rootEpic from './root-epic';
import rootReducer from './root-reducer';
import { persistState, loadState } from './storage';
import createReduxPromiseListener from 'redux-promise-listener';

export const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState, Services>({
    dependencies: services,
});

export const promiseListener = createReduxPromiseListener();

// configure middlewares
const middlewares = [epicMiddleware, promiseListener.middleware];

// compose enhancers
const enhancer = compose(applyMiddleware(...middlewares));

let store: Store | null = null;
export async function loadStore() {
    // rehydrate state on app start
    const initialState = await loadState();

    // create store
    store = createStore(rootReducer, initialState, enhancer);
    persistState(store, (x) => ({ auth: x.auth, diary: x.diary }));

    epicMiddleware.run(rootEpic);
}

export function getStore() {
    return store!;
}

// export store singleton instance
export default store;

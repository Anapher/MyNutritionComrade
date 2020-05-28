import { RootAction, RootState, Services } from 'MyNutritionComrade';
import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { persistStore } from 'redux-persist';
import createReduxPromiseListener from 'redux-promise-listener';
import services from '../services';
import rootEpic from './root-epic';
import rootReducer from './root-reducer';
import { composeEnhancers } from './utils';
import purgableReducer from './purgable-reducer';

export const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState, Services>({
    dependencies: services,
});

export const promiseListener = createReduxPromiseListener();

// configure middlewares
const middlewares = [epicMiddleware, promiseListener.middleware];

// compose enhancers
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

const store = createStore(purgableReducer(rootReducer), {}, enhancer);
epicMiddleware.run(rootEpic);

const persistor = persistStore(store);

// export store singleton instance
export default store;
export const rootPersistor = persistor;

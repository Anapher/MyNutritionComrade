import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, Reducer } from 'redux';
import { PersistConfig, persistReducer } from 'redux-persist';
import repoManager from '../features/repo-manager/reducer';
import settings, { SettingsState } from '../features/settings/reducer';
import diary from '../features/diary/reducer';
import productSearch from '../features/product-search/reducer';
import productAdd from '../features/product-add/reducer';
import productOverview from '../features/product-overview/reducer';

const settingsPersistConfig: PersistConfig<any> = {
   key: 'settings',
   storage: AsyncStorage,
};

const rootReducer = combineReducers({
   repoManager,
   diary,
   productSearch,
   productAdd,
   productOverview,
   settings: persistReducer(settingsPersistConfig, settings) as Reducer<SettingsState>,
});

export default rootReducer;

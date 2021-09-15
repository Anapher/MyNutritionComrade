import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { PersistConfig, persistReducer } from 'redux-persist';
import repoManager from '../features/repo-manager/reducer';
import settings from '../features/settings/reducer';
import diary from '../features/diary/reducer';

const settingsPersistConfig: PersistConfig<any> = {
   key: 'settings',
   storage: AsyncStorage,
};

const rootReducer = combineReducers({
   repoManager,
   diary,
   settings: persistReducer(settingsPersistConfig, settings),
});

export default rootReducer;

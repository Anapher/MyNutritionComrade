import { combineReducers } from 'redux';
import auth from 'src/features/auth/reducer';
import productSearch from 'src/features/product-search/reducer';
import diary from 'src/features/diary/reducer';
import addProduct from 'src/features/product-add/reducer';
import voteProductChanges from 'src/features/product-vote-changes/reducer';
import settings from 'src/features/settings/reducer';
import logWeight from 'src/features/log-weight/reducer';
import { persistReducer, persistStore } from 'redux-persist';
import { AsyncStorage } from 'react-native';

const rootReducer = combineReducers({
    auth: persistReducer({ whitelist: ['isAuthenticated', 'token'], storage: AsyncStorage, key: 'auth' }, auth),
    productSearch,
    diary: persistReducer({ storage: AsyncStorage, key: 'diary' }, diary),
    addProduct,
    voteProductChanges,
    settings,
    logWeight,
});

export default rootReducer;

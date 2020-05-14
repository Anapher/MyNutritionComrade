import { AsyncStorage } from 'react-native';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import auth from 'src/features/auth/reducer';
import diary from 'src/features/diary/reducer';
import logWeight from 'src/features/log-weight/reducer';
import addProduct from 'src/features/product-add/reducer';
import productSearch from 'src/features/product-search/reducer';
import voteProductChanges from 'src/features/product-vote-changes/reducer';
import settings from 'src/features/settings/reducer';
import meals from 'src/features/meals/reducer';

const rootReducer = combineReducers({
    auth: persistReducer({ whitelist: ['isAuthenticated', 'token'], storage: AsyncStorage, key: 'auth' }, auth),
    productSearch,
    diary: persistReducer({ storage: AsyncStorage, key: 'diary' }, diary),
    addProduct,
    voteProductChanges,
    settings,
    logWeight,
    meals,
});

export default rootReducer;

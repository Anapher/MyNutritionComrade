import { combineReducers } from 'redux';
import auth from 'src/features/auth/reducer';
import productSearch from 'src/features/product-search/reducer';

const rootReducer = combineReducers({
    auth,
    productSearch,
});

export default rootReducer;

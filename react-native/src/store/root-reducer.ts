import { combineReducers } from 'redux';
import auth from 'src/features/auth/reducer';
import productSearch from 'src/features/product-search/reducer';
import diary from 'src/features/diary/reducer';

const rootReducer = combineReducers({
    auth,
    productSearch,
    diary,
});

export default rootReducer;

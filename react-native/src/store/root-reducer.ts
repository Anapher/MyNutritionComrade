import { combineReducers } from 'redux';
import auth from 'src/features/auth/reducer';
import productSearch from 'src/features/product-search/reducer';
import diary from 'src/features/diary/reducer';
import addProduct from 'src/features/product-add/reducer';
import voteProductChanges from 'src/features/product-vote-changes/reducer';
import settings from 'src/features/settings/reducer';

const rootReducer = combineReducers({
    auth,
    productSearch,
    diary,
    addProduct,
    voteProductChanges,
    settings,
});

export default rootReducer;

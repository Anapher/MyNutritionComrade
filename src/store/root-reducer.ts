import { combineReducers } from 'redux';

import auth from 'src/features/auth/reducer';

const rootReducer = combineReducers({
    auth,
});

export default rootReducer;

import { combineEpics } from 'redux-observable';
import * as authEpics from 'src/features/auth/epics';
import * as productSearchEpics from 'src/features/product-search/epics';

export default combineEpics(...Object.values(authEpics), ...Object.values(productSearchEpics));

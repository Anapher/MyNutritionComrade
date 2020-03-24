import { combineEpics } from 'redux-observable';
import * as authEpics from 'src/features/auth/epics';
import * as productSearchEpics from 'src/features/product-search/epics';
import * as productCreateEpics from 'src/features/product-create/epics';

export default combineEpics(
    ...Object.values(authEpics),
    ...Object.values(productSearchEpics),
    ...Object.values(productCreateEpics),
);

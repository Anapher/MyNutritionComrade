import * as auth from '../features/auth/actions';
import * as productSearch from '../features/product-search/actions';
import * as productCreate from '../features/product-create/actions';
import * as diary from '../features/diary/actions';
import * as productAdd from '../features/product-add/actions';
import * as productVoteChanges from '../features/product-vote-changes/actions';
import * as settings from '../features/settings/actions';
import * as logWeight from '../features/log-weight/actions';
import * as meals from '../features/meals/actions';
import { purgeState } from './purgable-reducer';

export default {
    auth,
    productSearch,
    productCreate,
    diary,
    productAdd,
    productVoteChanges,
    settings,
    logWeight,
    meals,
    root: { purgeState },
};

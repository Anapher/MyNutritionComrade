import { combineEpics } from 'redux-observable';
import * as authEpics from 'src/features/auth/epics';
import * as productSearchEpics from 'src/features/product-search/epics';
import * as productCreateEpics from 'src/features/product-create/epics';
import * as diaryEpics from 'src/features/diary/epics';
import * as productAddEpics from 'src/features/product-add/epics';
import * as productVoteChangesEpics from 'src/features/product-vote-changes/epics';
import * as settingsEpics from '../features/settings/epics';
import * as logWeightEpics from '../features/log-weight/epics';
import * as mealsEpics from '../features/meals/epics';

export default combineEpics(
    ...Object.values(authEpics),
    ...Object.values(productSearchEpics),
    ...Object.values(productCreateEpics),
    ...Object.values(diaryEpics),
    ...Object.values(productAddEpics),
    ...Object.values(productVoteChangesEpics),
    ...Object.values(settingsEpics),
    ...Object.values(logWeightEpics),
    ...Object.values(mealsEpics),
);

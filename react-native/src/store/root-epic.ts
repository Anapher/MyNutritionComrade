import { combineEpics } from 'redux-observable';
import * as authEpics from 'src/features/auth/epics';
import * as productSearchEpics from 'src/features/product-search/epics';
import * as productCreateEpics from 'src/features/product-create/epics';
import * as diaryEpics from 'src/features/diary/epics';
import * as productAddEpics from 'src/features/product-add/epics';
import * as productVoteChangesEpics from 'src/features/product-vote-changes/epics';
import * as nutritionGoalsEpics from '../features/nutrition-goals/epics';

export default combineEpics(
    ...Object.values(authEpics),
    ...Object.values(productSearchEpics),
    ...Object.values(productCreateEpics),
    ...Object.values(diaryEpics),
    ...Object.values(productAddEpics),
    ...Object.values(productVoteChangesEpics),
    ...Object.values(nutritionGoalsEpics),
);

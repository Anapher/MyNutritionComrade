import { ProductContributionDto, ProductInfo } from 'Models';
import { RootAction } from 'MyNutritionComrade';
import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import * as actions from './actions';

export type VoteProductChangesState = Readonly<{
    changes: ProductContributionDto[] | null;
    product: ProductInfo | null;
    pendingVotes: { id: string; approve: boolean }[];
}>;

export default combineReducers<VoteProductChangesState, RootAction>({
    changes: (state = null, action) => {
        switch (action.type) {
            case getType(actions.init):
                return action.payload.contributions;
            case getType(actions.voteContribution.success):
                return state === null ? null : state.map((x) => (x.id === action.payload.id ? action.payload : x));
            default:
                return state;
        }
    },
    product: (state = null, action) => {
        switch (action.type) {
            case getType(actions.init):
                return action.payload.product;
            default:
                return state;
        }
    },
    pendingVotes: (state = [], action) => {
        switch (action.type) {
            case getType(actions.init):
                return [];
            case getType(actions.voteContribution.request):
                return [...state, { id: action.payload.productContributionId, approve: action.payload.approve }];
            case getType(actions.voteContribution.success):
                return state.filter((x) => x.id !== action.payload.id);
            case getType(actions.voteContribution.failure):
                return state.filter((x) => x.id !== action.payload.productContributionId);
            default:
                return state;
        }
    },
});

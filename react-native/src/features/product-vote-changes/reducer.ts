import { ProductContributionDto, ProductContributionStatus, ProductInfo } from 'Models';
import { RootAction } from 'MyNutritionComrade';
import { getType } from 'typesafe-actions';
import * as actions from './actions';

export type VoteProductChangesState = Readonly<{
    isLoading: boolean;
    changes: ProductContributionDto[] | null;
    totalChanges: number;
    filter: ProductContributionStatus | null;
    nextLink: string | null;
    product: ProductInfo | null;
    pendingVotes: { id: string; approve: boolean }[];
}>;

const initialState: VoteProductChangesState = {
    isLoading: false,
    totalChanges: 0,
    changes: null,
    filter: null,
    nextLink: null,
    product: null,
    pendingVotes: [],
};

const reducer = (state: VoteProductChangesState = initialState, action: RootAction): VoteProductChangesState => {
    switch (action.type) {
        case getType(actions.init):
            return { ...initialState, product: action.payload };
        case getType(actions.loadContributions.request):
            if (action.payload.productId !== state.product?.id) return state;
            return { ...state, isLoading: true };
        case getType(actions.loadContributions.success):
            if (action.payload.productId !== state.product?.id) return state;
            return {
                ...state,
                isLoading: false,
                filter: action.payload.filter || null,
                changes: action.payload.response.data,
                nextLink: action.payload.response.links.next,
                totalChanges: action.payload.response.meta.totalRecords,
            };
        case getType(actions.loadContributions.failure):
            if (action.payload.productId !== state.product?.id) return state;
            return { ...state, isLoading: false };
        case getType(actions.loadNextContributions.request):
            return { ...state, isLoading: true };
        case getType(actions.loadNextContributions.success):
            if (action.payload.data.some((x) => x.productId !== state.product?.id)) return state;

            return {
                ...state,
                isLoading: false,
                changes: [...state.changes, ...action.payload.data],
                nextLink: action.payload.links.next,
                totalChanges: action.payload.meta.totalRecords,
            };
        case getType(actions.loadNextContributions.failure):
            return { ...state, isLoading: false };
        case getType(actions.voteContribution.request):
            return {
                ...state,
                pendingVotes: [
                    ...state.pendingVotes,
                    { id: action.payload.productContributionId, approve: action.payload.approve },
                ],
            };
        case getType(actions.voteContribution.success):
            return {
                ...state,
                pendingVotes: state.pendingVotes.filter((x) => x.id !== action.payload.id),
                changes: state.changes?.map((x) => (x.id === action.payload.id ? action.payload : x)) ?? null,
            };
        case getType(actions.voteContribution.failure):
            return {
                ...state,
                pendingVotes: state.pendingVotes.filter((x) => x.id !== action.payload.productContributionId),
            };
        default:
            return state;
    }
};

export default reducer;

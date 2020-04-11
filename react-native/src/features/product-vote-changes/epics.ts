import { AxiosError } from 'axios';
import { RootEpic } from 'MyNutritionComrade';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import toErrorResult from 'src/utils/error-result';
import { isActionOf } from 'typesafe-actions';
import * as actions from './actions';

export const loadContributionsEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.loadContributions.request)),
        switchMap(({ payload: { productId, filter } }) =>
            from(api.products.getContributions(productId, filter)).pipe(
                map((response) => actions.loadContributions.success({ productId, response, filter })),
                catchError((error: AxiosError) =>
                    of(actions.loadContributions.failure({ error: toErrorResult(error), productId })),
                ),
            ),
        ),
    );

export const loadNextContributionsEpic: RootEpic = (action$, state$, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.loadNextContributions.request)),
        switchMap(() =>
            from(api.products.getContributionsByUrl(state$.value.voteProductChanges.nextLink!)).pipe(
                map((response) => actions.loadNextContributions.success(response)),
                catchError((error: AxiosError) => of(actions.loadNextContributions.failure(toErrorResult(error)))),
            ),
        ),
    );

export const voteProductContributionEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.voteContribution.request)),
        switchMap(({ payload: { approve, productContributionId } }) =>
            from(api.products.voteContribution(productContributionId, approve)).pipe(
                map((response) => actions.voteContribution.success(response)),
                catchError((error: AxiosError) =>
                    of(actions.voteContribution.failure({ error: toErrorResult(error), productContributionId })),
                ),
            ),
        ),
    );

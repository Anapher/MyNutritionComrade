import { AxiosError } from 'axios';
import { RootEpic } from 'MyNutritionComrade';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import toErrorResult from 'src/utils/error-result';
import { isActionOf } from 'typesafe-actions';
import * as actions from './actions';

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

import { AxiosError } from 'axios';
import { RootEpic } from 'MyNutritionComrade';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import toErrorResult from 'src/utils/error-result';
import { isActionOf } from 'typesafe-actions';
import * as actions from './actions';

export const loadProductContributionsEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.loadContributionsAsync.request)),
        switchMap(({ payload }) =>
            from(api.products.getContributions(payload, 'pending')).pipe(
                map((response) => actions.loadContributionsAsync.success(response)),
                catchError((error: AxiosError) => of(actions.loadContributionsAsync.failure(toErrorResult(error)))),
            ),
        ),
    );

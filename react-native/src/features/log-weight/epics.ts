import { AxiosError } from 'axios';
import { RootEpic } from 'MyNutritionComrade';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import toErrorResult from 'src/utils/error-result';
import { isActionOf } from 'typesafe-actions';
import * as actions from './actions';

export const loadEpic: RootEpic = (action$, state$, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.loadLoggedWeight.request)),
        switchMap(() =>
            from(
                state$.value.logWeight.nextLink
                    ? api.loggedWeight.getByUrl(state$.value.logWeight.nextLink)
                    : api.loggedWeight.get(),
            ).pipe(
                map((response) => actions.loadLoggedWeight.success(response)),
                catchError((error: AxiosError) => of(actions.loadLoggedWeight.failure(toErrorResult(error)))),
            ),
        ),
    );

export const addEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.addLoggedWeight.request)),
        switchMap(({ payload }) =>
            from(api.loggedWeight.add(payload)).pipe(
                map((response) => actions.addLoggedWeight.success(response)),
                catchError((error: AxiosError) => of(actions.addLoggedWeight.failure(toErrorResult(error)))),
            ),
        ),
    );

export const deleteEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.removeLoggedWeight.request)),
        switchMap(({ payload }) =>
            from(api.loggedWeight.deleteEntry(payload)).pipe(
                map(() => actions.removeLoggedWeight.success(payload)),
                catchError((error: AxiosError) => of(actions.removeLoggedWeight.failure(toErrorResult(error)))),
            ),
        ),
    );

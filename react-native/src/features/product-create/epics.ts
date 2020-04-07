import { AxiosError } from 'axios';
import { RootEpic } from 'MyNutritionComrade';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import toErrorResult from 'src/utils/error-result';
import { isActionOf } from 'typesafe-actions';
import * as actions from './actions';

export const createProductEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.createAsync.request)),
        switchMap(({ payload }) =>
            from(api.products.create(payload)).pipe(
                map((response) => actions.createAsync.success(response)),
                catchError((error: AxiosError) => of(actions.createAsync.failure(toErrorResult(error)))),
            ),
        ),
    );

export const changeProductEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.updateAsync.request)),
        switchMap(({ payload }) =>
            from(api.products.patch(payload.productId, payload.patch)).pipe(
                map(() => actions.updateAsync.success(undefined)),
                catchError((error: AxiosError) => of(actions.updateAsync.failure(toErrorResult(error)))),
            ),
        ),
    );

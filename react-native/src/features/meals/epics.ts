import { RootEpic } from 'MyNutritionComrade';
import { filter, switchMap, map, catchError } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { from, of } from 'rxjs';
import { AxiosError } from 'axios';
import toErrorResult from 'src/utils/error-result';
import * as actions from './actions';

export const loadEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.loadMealsAsync.request)),
        switchMap(() =>
            from(api.meals.get()).pipe(
                map((response) => actions.loadMealsAsync.success(response)),
                catchError((error: AxiosError) => of(actions.loadMealsAsync.failure(toErrorResult(error)))),
            ),
        ),
    );

export const createMealEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.createAsync.request)),
        switchMap(({ payload }) =>
            from(api.meals.create(payload)).pipe(
                map((response) => actions.createAsync.success(response)),
                catchError((error: AxiosError) => of(actions.createAsync.failure(toErrorResult(error)))),
            ),
        ),
    );

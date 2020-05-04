import { AxiosError } from 'axios';
import { RootEpic } from 'MyNutritionComrade';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import toErrorResult from 'src/utils/error-result';
import { isActionOf } from 'typesafe-actions';
import * as actions from './actions';

export const loadCurrentUserNutritionGoal: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.loadCurrentNutritionGoal.request)),
        switchMap(() =>
            from(api.nutritionGoal.get()).pipe(
                map((response) => actions.loadCurrentNutritionGoal.success(response)),
                catchError((error: AxiosError) => of(actions.loadCurrentNutritionGoal.failure(toErrorResult(error)))),
            ),
        ),
    );

export const patchCurrentUserNutritionGoal: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.patchNutritionGoal.request)),
        switchMap(({ payload }) =>
            from(api.nutritionGoal.patch(payload)).pipe(
                map((response) => actions.patchNutritionGoal.success(response)),
                catchError((error: AxiosError) => of(actions.patchNutritionGoal.failure(toErrorResult(error)))),
            ),
        ),
    );

export const loadPersonalInfo: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.loadPersonalInfo.request)),
        switchMap(() =>
            from(api.personalInfo.get()).pipe(
                map((response) => actions.loadPersonalInfo.success(response)),
                catchError((error: AxiosError) => of(actions.loadPersonalInfo.failure(toErrorResult(error)))),
            ),
        ),
    );

export const patchPersonalInfo: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.patchPersonalInfo.request)),
        switchMap(({ payload }) =>
            from(api.personalInfo.patch(payload)).pipe(
                map((response) => actions.patchPersonalInfo.success(response)),
                catchError((error: AxiosError) => of(actions.patchPersonalInfo.failure(toErrorResult(error)))),
            ),
        ),
    );

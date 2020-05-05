import { AxiosError } from 'axios';
import { RootEpic } from 'MyNutritionComrade';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import toErrorResult from 'src/utils/error-result';
import { isActionOf } from 'typesafe-actions';
import * as actions from './actions';

export const loadUserSettingsEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.loadUserSettings.request)),
        switchMap(() =>
            from(api.userSettings.get()).pipe(
                map((response) => actions.loadUserSettings.success(response)),
                catchError((error: AxiosError) => of(actions.loadUserSettings.failure(toErrorResult(error)))),
            ),
        ),
    );

export const patchUserSettingsEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.patchUserSettings.request)),
        switchMap(({ payload }) =>
            from(api.userSettings.patch(payload)).pipe(
                map((response) => actions.patchUserSettings.success(response)),
                catchError((error: AxiosError) => of(actions.patchUserSettings.failure(toErrorResult(error)))),
            ),
        ),
    );

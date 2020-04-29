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

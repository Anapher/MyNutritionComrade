import { AxiosError } from 'axios';
import { RootEpic } from 'MyNutritionComrade';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import toErrorResult from 'src/utils/error-result';
import { isActionOf, action } from 'typesafe-actions';
import * as actions from './actions';

export const loadFrequentProductsEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.loadFrequentlyUsedProducts.request)),
        switchMap(() =>
            from(api.userService.loadFrequentlyUsedProducts()).pipe(
                map((response) => actions.loadFrequentlyUsedProducts.success(response)),
                catchError((error: AxiosError) => of(actions.loadFrequentlyUsedProducts.failure(toErrorResult(error)))),
            ),
        ),
    );

export const loadDateEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.loadDate.request)),
        switchMap(({ payload }) =>
            from(api.consumption.getDayConsumption(payload)).pipe(
                map((response) => actions.loadDate.success({ date: payload, value: response })),
                catchError((error: AxiosError) => of(actions.loadDate.failure(toErrorResult(error)))),
            ),
        ),
    );

export const setProductConsumptionEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.setProductConsumption)),
        switchMap(({ payload }) =>
            from(api.consumption.setConsumption(payload.date, payload.time, payload.product.id, payload.value)).pipe(
                map(() => actions.changeProductConsumption.success(payload)),
                catchError((error: AxiosError) =>
                    of(
                        actions.changeProductConsumption.failure({
                            ...toErrorResult(error),
                            requestId: payload.requestId,
                        }),
                    ),
                ),
            ),
        ),
    );

export const appendProductConsumptionEpic: RootEpic = (action$, state$, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.appendProductConsumption)),
        switchMap(({ payload }) => {
            const appendedValue =
                (state$.value.diary.consumedProducts.find(
                    (x) => x.day === payload.date && x.time === payload.time && x.productId === payload.product.id,
                )?.nutritionInformation.volume ?? 0) + payload.value;

            return from(
                api.consumption.setConsumption(payload.date, payload.time, payload.product.id, appendedValue),
            ).pipe(
                map(() => actions.changeProductConsumption.success({ ...payload, value: appendedValue })),
                catchError((error: AxiosError) =>
                    of(
                        actions.changeProductConsumption.failure({
                            ...toErrorResult(error),
                            requestId: payload.requestId,
                        }),
                    ),
                ),
            );
        }),
    );

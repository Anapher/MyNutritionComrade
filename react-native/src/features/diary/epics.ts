import { AxiosError } from 'axios';
import { DateTime } from 'luxon';
import { ProductConsumptionDates } from 'Models';
import { RootEpic, RootState, Services } from 'MyNutritionComrade';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { addCreationDtoToFoodPortion, getCreationDtoId, getFoodPortionId } from 'src/utils/different-foods';
import toErrorResult, { RequestErrorResponse } from 'src/utils/error-result';
import { isActionOf } from 'typesafe-actions';
import * as logWeightActions from '../log-weight/actions';
import * as settingsActions from '../settings/actions';
import * as actions from './actions';
import { getRequiredDates, groupDatesInChunks, isDeleteRequest } from './utils';

export const loadFrequentlyConsumedEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.loadFrequentlyUsedProducts.request)),
        switchMap(() =>
            from(api.userService.loadFrequentlyConsumed()).pipe(
                map((response) => actions.loadFrequentlyUsedProducts.success(response)),
                catchError((error: AxiosError) => of(actions.loadFrequentlyUsedProducts.failure(toErrorResult(error)))),
            ),
        ),
    );

export const loadSelectedDateEpic: RootEpic = (action$, state$, services) =>
    action$.pipe(
        filter(isActionOf(actions.setSelectedDate.request)),
        switchMap(({ payload: date }) =>
            loadNewDate(
                DateTime.fromISO(date),
                state$.value,
                services,
                (data) => actions.setSelectedDate.success({ data, date }),
                (error) => actions.setSelectedDate.failure(error),
            ),
        ),
    );

function loadNewDate(
    selectedDate: DateTime,
    state: RootState,
    services: Services,
    successCreator: (data: ProductConsumptionDates) => any,
    failureCreator: (res: RequestErrorResponse) => any,
) {
    const loadedDates = Object.keys(state.diary.loadedDays);
    const today = DateTime.local();
    const requiredDates = getRequiredDates(today, selectedDate).map((x) => x.toISODate());
    const missing = requiredDates.filter((x) => !loadedDates.includes(x));

    if (missing.length === 0) return of(successCreator({}));

    return from(loadDates(services, missing)).pipe(
        map((data) => successCreator(data)),
        catchError((error: AxiosError) => of(failureCreator(toErrorResult(error)))),
    );
}

async function loadDates({ api }: Services, missingDates: string[]): Promise<ProductConsumptionDates> {
    const data: ProductConsumptionDates[] = [];

    const chunks = groupDatesInChunks(
        missingDates.map((x) => DateTime.fromISO(x)),
        10,
    );
    for (const c of chunks) {
        const d = await api.consumption.getConsumedProducts(
            c[0].toISODate(),
            c.length > 1 ? c[c.length - 1].toISODate() : undefined,
        );
        data.push(d);
    }

    return data.reduce((previous, val) => ({ ...previous, ...val }));
}

export const handleConsumptionAction: RootEpic = (action$, state$, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.patchConsumptions.request)),
        switchMap(({ payload }) => {
            if (isDeleteRequest(payload)) {
                return from(api.consumption.deleteConsumption(payload.date, payload.time, payload.foodPortionId)).pipe(
                    map(() => actions.patchConsumptions.success({ trigger: payload })),
                    catchError((error: AxiosError) =>
                        of(
                            actions.patchConsumptions.failure({
                                ...toErrorResult(error),
                                requestId: payload.requestId,
                            }),
                        ),
                    ),
                );
            } else {
                let creationDto = payload.creationDto;

                if (payload.append) {
                    const consumedProducts = state$.value.diary.loadedDays[payload.date];
                    const existingFoodPortion = consumedProducts.find(
                        (x) => getFoodPortionId(x.foodPortion) === getCreationDtoId(payload.creationDto),
                    );
                    if (existingFoodPortion !== undefined) {
                        creationDto = addCreationDtoToFoodPortion(creationDto, existingFoodPortion.foodPortion);
                    }
                }

                return from(api.consumption.createConsumption(payload.date, payload.time, creationDto)).pipe(
                    map((dto) => actions.patchConsumptions.success({ trigger: payload, dto })),
                    catchError((error: AxiosError) =>
                        of(
                            actions.patchConsumptions.failure({
                                ...toErrorResult(error),
                                requestId: payload.requestId,
                            }),
                        ),
                    ),
                );
            }
        }),
    );

export const loadComputedNutritionGoalsEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(
            isActionOf([
                actions.loadNutritionGoal.request,
                settingsActions.patchUserSettings.success,
                logWeightActions.addLoggedWeight.success,
                logWeightActions.removeLoggedWeight.success,
            ]),
        ),
        switchMap(() =>
            from(api.userService.sumNutritionGoal()).pipe(
                map((response) => actions.loadNutritionGoal.success(response)),
                catchError((error: AxiosError) => of(actions.loadNutritionGoal.failure(toErrorResult(error)))),
            ),
        ),
    );

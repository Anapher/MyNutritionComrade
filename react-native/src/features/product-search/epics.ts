import { RootEpic } from 'MyNutritionComrade';
import { empty, from, of } from 'rxjs';
import { catchError, debounceTime, filter, map, switchMap } from 'rxjs/operators';
import toErrorResult from 'src/utils/error-result';
import { tryParseServingSize } from 'src/utils/input-parser';
import { isActionOf } from 'typesafe-actions';
import * as actions from './actions';
import { mapToFoodSuggestion, querySuggestions } from './helpers';
import { SearchResult } from 'Models';

export const initSuggestionsEpic: RootEpic = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.initSearch)),
        map(() =>
            actions.setSuggestions(
                querySuggestions(
                    '',
                    state$.value.productSearch.consumptionTime,
                    state$.value.diary.frequentlyUsedProducts,
                    state$.value.diary.loadedDays,
                ),
            ),
        ),
    );

export const querySuggestionsEpic: RootEpic = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.setSearchText)),
        map(({ payload }) =>
            actions.setSuggestions(
                querySuggestions(
                    payload,
                    state$.value.productSearch.consumptionTime,
                    state$.value.diary.frequentlyUsedProducts,
                    state$.value.diary.loadedDays,
                ),
            ),
        ),
    );

export const apiSearchEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.setSearchText)),
        debounceTime(500),
        switchMap(({ payload }) => {
            const result = tryParseServingSize(payload);
            if (!result.productSearch) return empty();

            return from(
                api.products.search(
                    result.productSearch,
                    result.serving?.filter((x) => x.servingType !== undefined).map((x) => x.servingType!),
                ),
            ).pipe(
                map((response) =>
                    actions.appendSuggestions(
                        response.map<SearchResult>((x) => mapToFoodSuggestion(x, result.serving)),
                    ),
                ),
                catchError((e) => of(actions.suggestionRequestFailed(toErrorResult(e)))),
            );
        }),
    );

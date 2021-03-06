import { SearchResult } from 'Models';
import { RootEpic } from 'MyNutritionComrade';
import { empty, from, of } from 'rxjs';
import { catchError, debounceTime, filter, map, switchMap } from 'rxjs/operators';
import toErrorResult from 'src/utils/error-result';
import { tryParseServingSize } from 'src/utils/input-parser';
import { isActionOf } from 'typesafe-actions';
import * as actions from './actions';
import { querySuggestions, tryMapProductServing } from './helpers';

export const initSuggestionsEpic: RootEpic = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.initSearch)),
        map(() =>
            actions.setSuggestions(
                querySuggestions(
                    '',
                    state$.value.productSearch.config!,
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
                    state$.value.productSearch.config!,
                    state$.value.diary.frequentlyUsedProducts,
                    state$.value.diary.loadedDays,
                ),
            ),
        ),
    );

export const apiSearchEpic: RootEpic = (action$, state$, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.setSearchText)),
        debounceTime(500),
        switchMap(({ payload }) => {
            const searchQuery = tryParseServingSize(payload);
            if (!searchQuery.productSearch) return empty();

            return from(
                api.products.search(
                    searchQuery.productSearch,
                    searchQuery.serving?.filter((x) => x.servingType !== undefined).map((x) => x.servingType!),
                    state$.value.productSearch.config?.filter,
                ),
            ).pipe(
                map((response) =>
                    actions.appendSuggestions(
                        response.map<SearchResult>((x) => tryMapProductServing(x, searchQuery)),
                    ),
                ),
                catchError((e) => of(actions.suggestionRequestFailed(toErrorResult(e)))),
            );
        }),
    );

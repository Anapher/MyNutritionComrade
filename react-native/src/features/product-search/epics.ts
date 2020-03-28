import { AxiosError } from 'axios';
import itiriri from 'itiriri';
import _ from 'lodash';
import {
    ConsumptionTime,
    FoodSuggestion,
    FrequentlyUsedProductDto,
    FrequentlyUsedProducts,
    ProductLabel,
    ProductSearchDto,
    ServingSize,
} from 'Models';
import { RootEpic } from 'MyNutritionComrade';
import { empty, from } from 'rxjs';
import { catchError, debounceTime, filter, ignoreElements, map, switchMap } from 'rxjs/operators';
import { ConsumptionTimes, TagLiquid } from 'src/consts';
import { tryParseServingSize } from 'src/utils/input-parser';
import selectLabel from 'src/utils/label-selector';
import { isActionOf } from 'typesafe-actions';
import * as actions from './actions';

export const initSuggestionsEpic: RootEpic = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(actions.initSearch)),
        map(() =>
            actions.setSuggestions(
                querySuggestions(
                    '',
                    state$.value.productSearch.consumptionTime,
                    state$.value.diary.frequentlyUsedProducts,
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
                ),
            ),
        ),
    );

export const apiSearchEpic: RootEpic = (action$, _, { api }) =>
    action$.pipe(
        filter(isActionOf(actions.setSearchText)),
        debounceTime(500),
        switchMap(({ payload }) => {
            console.log('api call');

            const result = tryParseServingSize(payload);
            console.log(result);

            if (!result.productSearch) return empty();

            return from(
                api.products.search(
                    result.productSearch,
                    result.serving?.filter((x) => x.unit !== undefined).map((x) => x.unit!),
                ),
            ).pipe(
                map((response) =>
                    actions.appendSuggestions(
                        response.map<FoodSuggestion>((x) => mapToFoodSuggestion(x, result.serving)),
                    ),
                ),
                catchError((error: AxiosError) => {
                    console.log(error);
                    return ignoreElements();
                }),
            );
        }),
    );

const maxSearchResults: number = 10;

function querySuggestions(
    input: string,
    consumptionTime: ConsumptionTime,
    frequentlyUsedProducts: FrequentlyUsedProducts,
): FoodSuggestion[] {
    const productsOrder = flattenProductsPrioritize(frequentlyUsedProducts, consumptionTime);

    if (input === '') {
        // return most frequent items from last days
        return itiriri(productsOrder)
            .take(maxSearchResults)
            .map((x) => ({
                model: x,
            }))
            .toArray();
    }

    const result = tryParseServingSize(input);

    let entries = itiriri(productsOrder);
    if (result.productSearch !== undefined) {
        entries = entries.filter((x) => matchLabel(x.label, result.productSearch!));
    }

    if (result.serving) {
        entries = entries.filter((x) => getMatchingServing(result.serving!, x.servings) !== undefined);
    }

    return entries
        .take(maxSearchResults)
        .map<FoodSuggestion>((x) => mapToFoodSuggestion(x, result.serving))
        .toArray();
}

function mapToFoodSuggestion(dto: ProductSearchDto, parsedServing?: Partial<ServingSize>[]): FoodSuggestion {
    if (parsedServing) {
        const matchedServing = getMatchingServing(parsedServing, dto.servings)!;
        if (matchedServing.size) {
            return {
                model: dto,
                servingSize: {
                    size: matchedServing.size,
                    unit: matchedServing.unit || (dto.tags.includes(TagLiquid) ? 'ml' : 'g'),
                    conversion: matchedServing.conversion,
                },
            };
        }
    }

    return {
        // servingSize: { size: x.recentlyConsumedMass, unit: x.tags.includes(TagLiquid) ? 'ml' : 'g' },
        model: dto,
    };
}

function getMatchingServing(
    matchedServings: Partial<ServingSize>[],
    productServings: { [key: string]: number },
): Partial<ServingSize> | undefined {
    return itiriri(_.sortBy(matchedServings, (x) => x.unit !== undefined)) // sort by unit, so the servings with unit are at the top
        .filter((x) => (x.unit ? productServings[x.unit] !== undefined : true))
        .first();
}

function matchLabel(label: ProductLabel[], s: string): boolean {
    const labelText = selectLabel(label);
    return labelText.toUpperCase().includes(s.toUpperCase());
}

function* flattenProductsPrioritize(
    frequentlyUsedProducts: FrequentlyUsedProducts,
    priorizedTime: ConsumptionTime,
): Generator<FrequentlyUsedProductDto, void, never> {
    yield* frequentlyUsedProducts[priorizedTime];

    const lists = ConsumptionTimes.filter((x) => x !== priorizedTime).map((x) => ({
        list: frequentlyUsedProducts[x],
        i: 0,
    }));

    while (_.some(lists, (x) => x.i !== x.list.length)) {
        for (const o of lists) {
            if (o.i !== o.list.length) {
                yield o.list[o.i++];
            }
        }
    }
}

import itiriri from 'itiriri';
import _ from 'lodash';
import { DateTime } from 'luxon';
import {
    ConsumptionTime,
    FrequentlyConsumed,
    GeneratedMealSuggestion,
    ProductConsumptionDates,
    ProductSearchConfig,
    SearchResult,
} from 'Models';
import { ConsumptionTimes } from 'src/consts';
import { getSearchResultKey, matchSearchResult } from 'src/utils/different-foods';
import { getMatchingServing } from 'src/utils/food-utils';
import { ProductSearchQuery, tryParseServingSize } from 'src/utils/input-parser';
import { flattenProductsPrioritize } from 'src/utils/food-flattening';

const maxSearchResults: number = 10;

export function querySuggestions(
    input: string,
    config: ProductSearchConfig,
    frequentlyUsedProducts: FrequentlyConsumed,
    history: ProductConsumptionDates,
): SearchResult[] {
    const frequentlyUsedSearchResults = flattenProductsPrioritize(frequentlyUsedProducts, config?.consumptionTime);

    // return most frequent items from last days
    let query = itiriri(frequentlyUsedSearchResults);

    if (config.filter === undefined || config.filter.includes('meal')) {
        query = query.prepend(generateMeals(history, config));
    }

    if (input) {
        const searchQuery = tryParseServingSize(input);
        query = query.filter((x) => matchSearchResult(x, searchQuery)).map((x) => tryMapProductServing(x, searchQuery));
    }

    return query
        .distinct((x) => getSearchResultKey(x))
        .take(maxSearchResults)
        .toArray();
}

function* generateMeals(
    history: ProductConsumptionDates,
    config: ProductSearchConfig,
): Generator<GeneratedMealSuggestion> {
    const today = config?.date ?? DateTime.local().toISODate();

    yield* ConsumptionTimes.map((x) => GenerateMealSuggestion(today, x, history)).filter((x) => x !== undefined) as any;
}

function GenerateMealSuggestion(
    today: string,
    time: ConsumptionTime,
    history: ProductConsumptionDates,
): GeneratedMealSuggestion | undefined {
    const lastMeal = _.orderBy(Object.keys(history), (x) => x, 'desc').find(
        (time) => time !== today && history[time].find((x) => x.time === time),
    );

    if (lastMeal !== undefined) {
        const items = history[lastMeal].filter((x) => x.time === time).map((x) => x.foodPortion);

        return {
            type: 'generatedMeal',
            id: `${lastMeal}/${time}`,
            items,
        };
    }

    return undefined;
}

export function tryMapProductServing(searchResult: SearchResult, searchQuery: ProductSearchQuery): SearchResult {
    if (searchResult.type === 'product' && searchQuery.serving !== undefined) {
        const matchedServing = getMatchingServing(searchQuery.serving, searchResult.product.servings)!;
        if (matchedServing.amount) {
            return {
                type: 'serving',
                product: searchResult.product,
                amount: matchedServing.amount,
                servingType: matchedServing.servingType || searchResult.product.defaultServing,
                convertedFrom: matchedServing.convertedFrom,
            };
        }
    }

    return searchResult;
}

export function compareSearchResults(s1: SearchResult, s2: SearchResult): boolean {
    return getSearchResultKey(s1) === getSearchResultKey(s2);
}

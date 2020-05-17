import itiriri from 'itiriri';
import _ from 'lodash';
import { DateTime } from 'luxon';
import {
    ConsumptionTime,
    FrequentlyUsedProducts,
    GeneratedMealSuggestion,
    ProductConsumptionDates,
    ProductInfo,
    ProductLabel,
    ProductSearchConfig,
    SearchResult,
    ServingSize,
} from 'Models';
import { ConsumptionTimes } from 'src/consts';
import { tryParseServingSize } from 'src/utils/input-parser';
import selectLabel, { flattenProductsPrioritize } from 'src/utils/product-utils';
import handlers from './search-result-handler';
import { capitalizeFirstLetter } from 'src/utils/string-utils';

const maxSearchResults: number = 10;

export function querySuggestions(
    input: string,
    config: ProductSearchConfig,
    frequentlyUsedProducts: FrequentlyUsedProducts,
    history: ProductConsumptionDates,
): SearchResult[] {
    const productsOrder = flattenProductsPrioritize(frequentlyUsedProducts, config?.consumptionTime);

    if (input === '') {
        // return most frequent items from last days
        let query = itiriri(productsOrder)
            .distinct((x) => x.id)
            .take(maxSearchResults)
            .map<SearchResult>((product) => ({
                type: 'product',
                product,
            }));

        if (config.filter === undefined || config.filter.includes('meal')) {
            query = query.prepend(generateMeals(history, config));
        }

        return query.toArray();
    }

    const result = tryParseServingSize(input);

    let entries = itiriri(productsOrder);
    if (result.productSearch !== undefined) {
        entries = entries.filter((x) => matchLabel(x.label, result.productSearch!));
    }

    if (result.serving) {
        entries = entries.filter((x) => getMatchingServing(result.serving!, x.servings) !== undefined);
    }

    let query = entries
        .distinct((x) => x.id)
        .take(maxSearchResults)
        .map<SearchResult>((x) => mapToFoodSuggestion(x, result.serving));

    if (config.filter === undefined || config.filter.includes('meal')) {
        query = query.prepend(
            itiriri(generateMeals(history, config)).filter(
                (x) =>
                    result.productSearch !== undefined &&
                    result.serving === undefined &&
                    getGeneratedMealName(x).toUpperCase().includes(result.productSearch.toUpperCase()),
            ),
        );
    }

    return query.toArray();
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

export function mapToFoodSuggestion(product: ProductInfo, parsedServing?: Partial<ServingSize>[]): SearchResult {
    if (parsedServing) {
        const matchedServing = getMatchingServing(parsedServing, product.servings)!;
        if (matchedServing.amount) {
            return {
                type: 'serving',
                product,
                amount: matchedServing.amount,
                servingType: matchedServing.servingType || product.defaultServing,
                convertedFrom: matchedServing.convertedFrom,
            };
        }
    }

    return {
        type: 'product',
        product,
    };
}

function getMatchingServing(
    matchedServings: Partial<ServingSize>[],
    productServings: { [key: string]: number },
): Partial<ServingSize> | undefined {
    return itiriri(_.sortBy(matchedServings, (x) => x.servingType !== undefined)) // sort by unit, so the servings with unit are at the top
        .filter((x) => (x.servingType ? productServings[x.servingType] !== undefined : true))
        .first();
}

function matchLabel(label: ProductLabel[], s: string): boolean {
    const labelText = selectLabel(label);
    return labelText.toUpperCase().includes(s.toUpperCase());
}

export function compareSearchResults(s1: SearchResult, s2: SearchResult): boolean {
    return handlers[s1.type]?.getKey(s1) === handlers[s2.type]?.getKey(s2);
}

export function getGeneratedMealName(generatedMeal: GeneratedMealSuggestion): string {
    const splitter = generatedMeal.id.split('/');
    const time: ConsumptionTime = splitter[1] as any;
    const day = splitter[0];
    const yesterday = day === DateTime.local().minus({ days: 1 }).toISODate();

    return yesterday
        ? `Yesterdays ${capitalizeFirstLetter(time)}`
        : `${capitalizeFirstLetter(time)} from ${DateTime.fromISO(day).toLocaleString(DateTime.DATE_HUGE)}`;
}

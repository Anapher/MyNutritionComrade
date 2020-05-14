import itiriri from 'itiriri';
import _ from 'lodash';
import {
    ConsumptionTime,
    FrequentlyUsedProducts,
    ProductConsumptionDates,
    ProductInfo,
    ProductLabel,
    SearchResult,
    ServingSize,
    MealSuggestion,
} from 'Models';
import { tryParseServingSize } from 'src/utils/input-parser';
import selectLabel, { flattenProductsPrioritize, getBaseUnit } from 'src/utils/product-utils';
import { DateTime } from 'luxon';
import { capitalizeFirstLetter } from 'src/utils/string-utils';

const maxSearchResults: number = 10;

export function querySuggestions(
    input: string,
    consumptionTime: ConsumptionTime,
    frequentlyUsedProducts: FrequentlyUsedProducts,
    history: ProductConsumptionDates,
): SearchResult[] {
    const productsOrder = flattenProductsPrioritize(frequentlyUsedProducts, consumptionTime);

    if (input === '') {
        // return most frequent items from last days
        return itiriri(productsOrder)
            .distinct((x) => x.id)
            .take(maxSearchResults)
            .map<SearchResult>((product) => ({
                type: 'product',
                product,
            }))
            .prepend(generateMeals(consumptionTime, history))
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
        .distinct((x) => x.id)
        .take(maxSearchResults)
        .map<SearchResult>((x) => mapToFoodSuggestion(x, result.serving))
        .prepend(
            itiriri(generateMeals(consumptionTime, history)).filter(
                (x) =>
                    result.productSearch !== undefined &&
                    result.serving === undefined &&
                    x.name.toUpperCase().includes(result.productSearch.toUpperCase()),
            ),
        )
        .toArray();
}

function* generateMeals(consumptionTime: ConsumptionTime, history: ProductConsumptionDates): Generator<MealSuggestion> {
    const today = DateTime.local().toISODate();
    const lastMeal = _.orderBy(Object.keys(history), (x) => x, 'desc').find(
        (time) => time !== today && history[time].find((x) => x.time === consumptionTime),
    );

    if (lastMeal !== undefined) {
        const products = history[lastMeal].filter((x) => x.time === consumptionTime);
        const yesterday = lastMeal === DateTime.local().minus({ days: 1 }).toISODate();

        yield {
            type: 'meal',
            id: `INTERNAL/${consumptionTime}`,
            name: yesterday
                ? `Yesterdays ${capitalizeFirstLetter(consumptionTime)}`
                : `${capitalizeFirstLetter(consumptionTime)} from ${DateTime.fromISO(lastMeal).toLocaleString(
                      DateTime.DATE_HUGE,
                  )}`,
            products: products.map((product) => ({
                product: { ...product, id: product.productId },
                servingSize: { servingType: getBaseUnit(product), amount: product.nutritionalInfo.volume },
            })),
        };
    }
}

export function mapToFoodSuggestion(product: ProductInfo, parsedServing?: Partial<ServingSize>[]): SearchResult {
    if (parsedServing) {
        const matchedServing = getMatchingServing(parsedServing, product.servings)!;
        if (matchedServing.amount) {
            return {
                type: 'serving',
                product,
                servingSize: {
                    amount: matchedServing.amount,
                    servingType: matchedServing.servingType || product.defaultServing,
                    convertedFrom: matchedServing.convertedFrom,
                },
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
    if (s1.type === 'meal' && s2.type === 'meal') {
        return s1.id === s2.id;
    }

    if (s1.type === 'product' && s2.type === 'product') {
        return s1.product.id === s2.product.id;
    }

    if (s1.type === 'serving' && s2.type === 'serving') {
        return (
            s1.product.id === s2.product.id &&
            s1.servingSize.amount === s2.servingSize.amount &&
            s1.servingSize.servingType === s2.servingSize.servingType &&
            s1.servingSize.convertedFrom?.name === s2.servingSize.convertedFrom?.name
        );
    }

    // different types
    return false;
}

import itiriri from 'itiriri';
import _ from 'lodash';
import {
    ConsumptionTime,
    FoodSuggestion,
    FrequentlyUsedProducts,
    ProductLabel,
    ProductSearchDto,
    ServingSize,
} from 'Models';
import { tryParseServingSize } from 'src/utils/input-parser';
import selectLabel from 'src/utils/product-utils';
import { flattenProductsPrioritize } from 'src/utils/product-utils';

const maxSearchResults: number = 10;

export function querySuggestions(
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

export function mapToFoodSuggestion(dto: ProductSearchDto, parsedServing?: Partial<ServingSize>[]): FoodSuggestion {
    if (parsedServing) {
        const matchedServing = getMatchingServing(parsedServing, dto.servings)!;
        if (matchedServing.size) {
            return {
                model: dto,
                servingSize: {
                    size: matchedServing.size,
                    unit: matchedServing.unit || dto.defaultServing,
                    conversion: matchedServing.conversion,
                },
            };
        }
    }

    return {
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

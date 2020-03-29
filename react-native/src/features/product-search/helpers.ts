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
import { ConsumptionTimes, TagLiquid } from 'src/consts';
import { tryParseServingSize } from 'src/utils/input-parser';
import selectLabel from 'src/utils/label-selector';

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

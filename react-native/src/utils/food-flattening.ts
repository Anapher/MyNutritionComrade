import _ from 'lodash';
import { ConsumptionTime, FrequentlyConsumed, SearchResult } from 'Models';
import { ConsumptionTimes } from 'src/consts';
import { mapFoodPortionDtoToSearchResult } from './different-foods';

/**
 * Flatten {@see FrequentlyUsedProducts} by first returning all products of the priorizedTime
 * and then returning the first products of the other times until all products are returned
 * @param frequentlyUsedProducts the frequently used products
 * @param priorizedTime the prioritized time
 */
export function* flattenProductsPrioritize(
    frequentlyUsedProducts: FrequentlyConsumed,
    priorizedTime?: ConsumptionTime,
): Generator<SearchResult, void, never> {
    if (priorizedTime !== undefined) {
        yield* frequentlyUsedProducts[priorizedTime]?.map(mapFoodPortionDtoToSearchResult);
    }

    const lists = ConsumptionTimes.filter((x) => x !== priorizedTime).map((x) => ({
        list: frequentlyUsedProducts[x] || [],
        i: 0,
    }));

    while (_.some(lists, (x) => x.i !== x.list.length)) {
        for (const o of lists) {
            if (o.i !== o.list.length) {
                yield mapFoodPortionDtoToSearchResult(o.list[o.i++]);
            }
        }
    }
}

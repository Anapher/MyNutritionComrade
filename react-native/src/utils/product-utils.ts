import { TagLiquid } from 'src/consts';
import { FrequentlyUsedProducts, ConsumptionTime, FrequentlyUsedProductDto, ProductInfo } from 'Models';
import { ConsumptionTimes } from 'src/consts';
import _ from 'lodash';

export function* flattenProductsPrioritize(
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

export function isProductLiquid(product: ProductInfo): boolean {
    return product.tags.includes(TagLiquid);
}

export function getBaseUnit(product: ProductInfo): string {
    return isProductLiquid(product) ? 'ml' : 'g';
}

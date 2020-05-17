import _ from 'lodash';
import {
    ConsumptionTime,
    FrequentlyUsedProductDto,
    FrequentlyUsedProducts,
    NutritionalInfo,
    ProductEssentials,
    ProductLabel,
} from 'Models';
import { ConsumptionTimes, TagLiquid } from 'src/consts';

/**
 * Change the volume of a {@see NutritionalInfo} and calculate the new nutrtional values
 * @param info the nutritional information
 * @param newVolume the new volume
 */
export function changeVolume(info: NutritionalInfo, newVolume: number): NutritionalInfo {
    if (info.volume === 0) throw 'Cannot calculate a new volume if the information are based on a zero volume';

    const factor = newVolume / info.volume;

    return {
        volume: newVolume,
        energy: info.energy * factor,
        fat: info.fat * factor,
        saturatedFat: info.saturatedFat * factor,
        carbohydrates: info.carbohydrates * factor,
        sugars: info.sugars * factor,
        protein: info.protein * factor,
        dietaryFiber: info.dietaryFiber * factor,
        sodium: info.sodium * factor,
    };
}

/**
 * Change the volume of a {@see NutritionalInfo} and calculate the new nutrtional values
 * @param info the nutritional information
 * @param newVolume the new volume
 */
export function sumNutritions(nutritions: NutritionalInfo[]): NutritionalInfo {
    return {
        volume: _.sumBy(nutritions, (x) => x.volume),
        energy: _.sumBy(nutritions, (x) => x.energy),
        fat: _.sumBy(nutritions, (x) => x.fat),
        saturatedFat: _.sumBy(nutritions, (x) => x.saturatedFat),
        carbohydrates: _.sumBy(nutritions, (x) => x.carbohydrates),
        sugars: _.sumBy(nutritions, (x) => x.sugars),
        protein: _.sumBy(nutritions, (x) => x.protein),
        dietaryFiber: _.sumBy(nutritions, (x) => x.dietaryFiber),
        sodium: _.sumBy(nutritions, (x) => x.sodium),
    };
}

/**
 * Flatten {@see FrequentlyUsedProducts} by first returning all products of the priorizedTime
 * and then returning the first products of the other times until all products are returned
 * @param frequentlyUsedProducts the frequently used products
 * @param priorizedTime the prioritized time
 */
export function* flattenProductsPrioritize(
    frequentlyUsedProducts: FrequentlyUsedProducts,
    priorizedTime?: ConsumptionTime,
): Generator<FrequentlyUsedProductDto, void, never> {
    if (priorizedTime !== undefined) {
        yield* frequentlyUsedProducts[priorizedTime];
    }

    const lists = ConsumptionTimes.filter((x) => x !== priorizedTime).map((x) => ({
        list: frequentlyUsedProducts[x] || [],
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

/**
 * Return true if the product is a liquid
 * @param product the product
 */
export function isProductLiquid(product: ProductEssentials): boolean {
    return product.tags.includes(TagLiquid);
}

/**
 * Return the base unit for the product. 'ml' for liquids, 'g' else
 * @param product the product
 */
export function getBaseUnit(product: ProductEssentials): string {
    return isProductLiquid(product) ? 'ml' : 'g';
}

export default function selectLabel(label: ProductLabel[]): string {
    return label[0].value;
}

import _ from 'lodash';
import { NutritionalInfo, ProductEssentials, ProductLabelInfo } from 'Models';
import { TagLiquid } from 'src/consts';
import { computeHashCode } from './string-utils';

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

export function computeNutritionHash(nutritionalInfo: NutritionalInfo): string {
    const normalized = nutritionalInfo.volume === 100 ? nutritionalInfo : changeVolume(nutritionalInfo, 100);
    return computeHashCode(JSON.stringify(normalized)).toString();
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

export default function selectLabel(label: ProductLabelInfo): string {
    return label[Object.keys(label)[0]].value;
}

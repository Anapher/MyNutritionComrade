import { ProductEssentials, ProductTags } from 'src/types';
import { formatNumber } from './string-utils';

/**
 * Return the base unit for the product. 'ml' for liquids, 'g' else
 * @param value the product
 */
export function getBaseUnit(value?: ProductEssentials | ProductTags): 'ml' | 'g' {
   const tags = isProduct(value) ? value.tags : value;
   return tags?.liquid ? 'ml' : 'g';
}

function isProduct(product?: ProductEssentials | ProductTags): product is ProductEssentials {
   return (product as ProductEssentials)?.label !== undefined;
}

export function formatNutritionalValue(value: number, unit: string) {
   return formatNumber(value, 2) + unit;
}

import { TagLiquid } from 'src/consts';
import { ProductEssentials } from 'src/types';

/**
 * Return true if the product is a liquid
 * @param product the product
 */
export function isProductLiquid(product: ProductEssentials): boolean {
   return product.tags?.includes(TagLiquid) === true;
}

/**
 * Return the base unit for the product. 'ml' for liquids, 'g' else
 * @param product the product
 */
export function getBaseUnit(product: ProductEssentials): string {
   return isProductLiquid(product) ? 'ml' : 'g';
}

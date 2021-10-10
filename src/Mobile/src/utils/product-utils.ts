import { ProductEssentials, ProductTags } from 'src/types';

/**
 * Return the base unit for the product. 'ml' for liquids, 'g' else
 * @param value the product
 */
export function getBaseUnit(value?: ProductEssentials | ProductTags): string {
   const tags = isProduct(value) ? value.tags : value;
   return tags?.liquid ? 'ml' : 'g';
}

function isProduct(product?: ProductEssentials | ProductTags): product is ProductEssentials {
   return (product as ProductEssentials)?.label !== undefined;
}

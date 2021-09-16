import _ from 'lodash';
import { SearchResult, ServingSize } from 'src/features/product-search/types';
import { Product } from 'src/types';
import fuzzySearch, { prepareProduct } from './fuzzy-search';
import { ProductSearchQuery, tryParseServingSize } from './input-parser';
import { ProductSearchConfig } from './types';

export default function searchProducts(s: string, products: Product[], config?: ProductSearchConfig): SearchResult[] {
   const result = tryParseServingSize(s);

   if (result.productSearch) {
      const index = products.flatMap((x) => prepareProduct(x));
      const servingTypes = result.serving?.map((x) => x.servingType).filter((x): x is string => !!x);

      const searchResults = fuzzySearch(result.productSearch, index, servingTypes);

      return searchResults
         .map((x) => products.find((p) => p.id === x.obj.id)!)
         .map((x) => mapProductToSearchResult(x, result));
   }

   return products.slice(0, 10).map((x) => mapProductToSearchResult(x, result));
}

function mapProductToSearchResult(product: Product, searchQuery: ProductSearchQuery): SearchResult {
   if (searchQuery.serving !== undefined) {
      const matchedServing = getMatchingServing(searchQuery.serving, product.servings)!;
      if (matchedServing?.amount) {
         return {
            type: 'serving',
            product: product,
            amount: matchedServing.amount,
            servingType: matchedServing.servingType || product.defaultServing,
            convertedFrom: matchedServing.convertedFrom,
         };
      }
   }

   return { type: 'product', product };
}

export function getMatchingServing(
   matchedServings: Partial<ServingSize>[],
   productServings: { [key: string]: number },
): Partial<ServingSize> | undefined {
   return _(matchedServings)
      .filter((x) => !x.servingType || productServings[x.servingType] !== undefined)
      .sortBy((x) => x.servingType !== undefined) // sort by unit, so the servings with unit are at the top
      .first();
}

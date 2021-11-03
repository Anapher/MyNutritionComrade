import _ from 'lodash';
import { SearchResult, ServingSize } from 'src/features/product-search/types';
import { Product } from 'src/types';
import { getBaseUnit } from 'src/utils/product-utils';
import fuzzySearch, { SearchEntry } from './fuzzy-search';
import { ProductSearchQuery, tryParseServingSize } from './input-parser';
import { SearchIndex } from './search-index';
import { ProductSearchConfig } from './types';

const MAX_ENERGY_DEFAULT_SERVING = 5000;

export default function searchIndex(s: string, index: SearchIndex, config?: ProductSearchConfig): SearchResult[] {
   const result = tryParseServingSize(s);

   if (result.productSearch) {
      const servingTypes = result.serving?.map((x) => x.servingType).filter((x): x is string => !!x);
      const searchResults = fuzzySearch(
         result.productSearch,
         index.entries,
         config?.scores,
         servingTypes,
         config?.limit,
      );

      return searchResults.map((x) => mapSearchEntryToResult(x.obj, result, index));
   }

   return _(index.entries)
      .orderBy((x) => config?.scores?.get(x.foodId) ?? 0, 'desc')
      .uniqBy((x) => x.foodId)
      .take(config?.limit ?? 50)
      .map((x) => mapSearchEntryToResult(x, result, index))
      .value();
}

function mapSearchEntryToResult(
   searchEntry: SearchEntry,
   searchQuery: ProductSearchQuery,
   index: SearchIndex,
): SearchResult {
   switch (searchEntry.type) {
      case 'product':
         const product = index.products[searchEntry.id];
         return mapProductToSearchResult(product, searchQuery);
      case 'meal':
         return { type: 'meal', meal: index.meals[searchEntry.mealId] };
   }
}

function mapProductToSearchResult(product: Product, searchQuery: ProductSearchQuery): SearchResult {
   if (searchQuery.serving !== undefined) {
      const matchedServing = getMatchingServing(searchQuery.serving, product.servings)!;
      if (matchedServing?.amount) {
         return {
            type: 'serving',
            product: product,
            amount: matchedServing.amount,
            servingType: findReasonableServingType(product, matchedServing.amount, matchedServing.servingType),
            convertedFrom: matchedServing.convertedFrom,
         };
      }
   }

   return { type: 'product', product };
}

function findReasonableServingType(product: Product, amount: number, matchedServing?: string) {
   if (matchedServing) return matchedServing;

   const energyPerBaseUnit = product.nutritionalInfo.energy / product.nutritionalInfo.volume;

   if (energyPerBaseUnit * product.servings[product.defaultServing] * amount <= MAX_ENERGY_DEFAULT_SERVING) {
      return product.defaultServing;
   }

   return getBaseUnit(product);
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

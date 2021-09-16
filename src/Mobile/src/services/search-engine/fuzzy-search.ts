import fuzzysort from 'fuzzysort';
import _ from 'lodash';
import { Product } from 'src/types';

type PreparedProduct = {
   id: string;
   label: Fuzzysort.Prepared;
   language: string;
   servingTypes: string[];
};

export default function fuzzySearch(s: string, searchIndex: PreparedProduct[], servingType?: string[], limit?: number) {
   if (servingType && servingType.length > 0) {
      searchIndex = filterServingType(searchIndex, servingType);
   }

   const result = fuzzysort.go(s, searchIndex, { key: 'label', limit });
   return removeDuplicateResults(result);
}

export function prepareProduct(product: Product): PreparedProduct[] {
   const result: PreparedProduct[] = [];
   const info = { id: product.id, servingTypes: Object.keys(product.servings) };

   for (const [language, label] of Object.entries(product.label)) {
      result.push({ ...info, label: fuzzysort.prepare(label.value)!, language });

      if (label.tags) {
         for (const tag of label.tags) {
            result.push({ ...info, label: fuzzysort.prepare(tag)!, language });
         }
      }
   }
   return result;
}

function filterServingType(searchIndex: PreparedProduct[], servingType: string[]): PreparedProduct[] {
   const servingTypeSet = new Set(servingType);

   return searchIndex.filter((x) => x.servingTypes.find((x) => servingTypeSet.has(x)));
}

function removeDuplicateResults(result: Fuzzysort.KeyResults<PreparedProduct>): Fuzzysort.KeyResult<PreparedProduct>[] {
   const productIds = new Set<string>();
   const processedResult: Fuzzysort.KeyResult<PreparedProduct>[] = [];

   for (const res of result) {
      if (productIds.has(res.obj.id)) continue;
      productIds.add(res.obj.id);

      processedResult.push(res);
   }

   return processedResult;
}

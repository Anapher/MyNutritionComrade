import fuzzysort from 'fuzzysort';

export type ProductSearchEntry = {
   type: 'product';
   id: string;
   label: Fuzzysort.Prepared;
   language: string;
   servingTypes: string[];
   foodId: string;
};

export type MealSearchEntry = {
   type: 'meal';
   label: Fuzzysort.Prepared;
   mealId: string;
   foodId: string;
};

export type SearchEntry = ProductSearchEntry | MealSearchEntry;

export default function fuzzySearch(
   s: string,
   searchIndex: SearchEntry[],
   scores?: Map<string, number>,
   servingType?: string[],
   limit?: number,
) {
   if (servingType && servingType.length > 0) {
      searchIndex = filterServingType(searchIndex, servingType);
   }

   const result = fuzzysort.go(s, searchIndex, {
      keys: ['label'],
      limit,
      scoreFn: !scores
         ? undefined
         : (keysResult) => {
              const keyResult = keysResult[0];
              if (!keyResult) return -Infinity;

              const obj = (keysResult as any).obj as SearchEntry;
              return keyResult.score + (scores.get(obj.foodId) ?? 0);
           },
   });

   return removeDuplicateResults(result);
}

function filterServingType(searchIndex: SearchEntry[], servingType: string[]): SearchEntry[] {
   const servingTypeSet = new Set(servingType);
   return searchIndex.filter((x) => x.type !== 'product' || x.servingTypes.find((x) => servingTypeSet.has(x)));
}

function removeDuplicateResults(result: Fuzzysort.KeysResults<SearchEntry>): Fuzzysort.KeysResult<SearchEntry>[] {
   const productIds = new Set<string>();
   const processedResult: Fuzzysort.KeysResult<SearchEntry>[] = [];

   for (const res of result) {
      // because multiple entries for each products may exist for labels/tags
      if (productIds.has(res.obj.foodId)) continue;

      productIds.add(res.obj.foodId);
      processedResult.push(res);
   }

   return processedResult;
}

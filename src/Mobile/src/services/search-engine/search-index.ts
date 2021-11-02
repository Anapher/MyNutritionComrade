import fuzzysort from 'fuzzysort';
import { Meal, Product } from 'src/types';
import { getFoodPortionId } from 'src/utils/food-portion-utils';
import { MealSearchEntry, ProductSearchEntry, SearchEntry } from './fuzzy-search';

export default async function buildSearchIndex(meals: Meal[], products: Record<string, Product>): Promise<SearchIndex> {
   return {
      entries: [...Object.values(products).flatMap(prepareProduct), ...meals.map(prepareMeal)],
      products,
      meals: Object.fromEntries(meals.map((x) => [x.id, x])),
   };
}

export type SearchIndex = {
   entries: SearchEntry[];
   products: Record<string, Product>;
   meals: Record<string, Meal>;
};

export function prepareProduct(product: Product): ProductSearchEntry[] {
   const result: ProductSearchEntry[] = [];
   const info = {
      id: product.id,
      servingTypes: Object.keys(product.servings),
      foodId: getFoodPortionId({ type: 'product', product }),
   };

   for (const [language, label] of Object.entries(product.label)) {
      result.push({ ...info, type: 'product', label: fuzzysort.prepare(label.value)!, language });

      if (label.tags) {
         for (const tag of label.tags) {
            result.push({ ...info, type: 'product', label: fuzzysort.prepare(tag)!, language });
         }
      }
   }
   return result;
}

export function prepareMeal(meal: Meal): MealSearchEntry {
   return {
      type: 'meal',
      label: fuzzysort.prepare(meal.name)!,
      mealId: meal.id,
      foodId: getFoodPortionId({ type: 'meal', mealId: meal.id }),
   };
}

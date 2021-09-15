import { computeNutritionHash } from 'src/utils/nutrition-utils';
import { SearchResult } from './types';

export function getSearchResultKey(result: SearchResult): string {
   let key: string;

   switch (result.type) {
      case 'meal':
         key = result.mealId;
         break;
      case 'product':
         key = result.product.id;
         break;
      case 'serving':
         key = `${result.product.id}/${result.servingType}/${result.amount}/${result.convertedFrom?.name}`;
         break;
      case 'generatedMeal':
         key = result.id;
         break;
      case 'custom':
         key = computeNutritionHash(result.nutritionalInfo);
         break;
   }

   return result.type + '/' + key;
}

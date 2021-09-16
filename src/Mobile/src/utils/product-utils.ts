import { DateTime } from 'luxon';
import { generatedMealIds, TagLiquid } from 'src/consts';
import { ConsumedPortion, FoodPortion, ProductEssentials, RecentMealSuggestion } from 'src/types';
import { computeNutritionHash } from './nutrition-utils';
import { parse } from 'search-params';
import { TFunction } from 'i18next';

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

export function getFoodPortionId(portion: FoodPortion): string {
   let key: string;

   switch (portion.type) {
      case 'meal':
         key = portion.mealId;
         break;
      case 'product':
         key = portion.product.id;
         break;
      case 'suggestion':
         key = portion.suggestionId;
         break;
      case 'custom':
         key = computeNutritionHash(portion.nutritionalInfo);
         break;
   }

   return `${portion.type}@${key}`;
}

export function getConsumedPortionId(portion: ConsumedPortion): string {
   const foodPortionId = getFoodPortionId(portion.foodPortion);
   return `${portion.date}/${portion.time}/${foodPortionId}`;
}

export function suggestionIdToString(id: string, t: TFunction): string {
   const parts = id.split('?', 2);

   if (parts[0] === generatedMealIds.recentMeal) {
      const query = parse<RecentMealSuggestion>(parts[1]);
      const yesterday = query.date === DateTime.local().minus({ days: 1 }).toISODate();

      return yesterday
         ? t('product_search.recent_meal_yesterday', { time: `$t(consumption_time.${query.time})` })
         : t('product_search.recent_meal', { time: `$t(consumption_time.${query.time})`, date: query.date });
   }

   return 'Unknown';
}

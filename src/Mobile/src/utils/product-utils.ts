import { DateTime } from 'luxon';
import { generatedMealIds, TagLiquid } from 'src/consts';
import {
   ConsumedPortion,
   FoodPortion,
   FoodPortionCreationDto,
   Product,
   ProductEssentials,
   RecentMealSuggestion,
} from 'src/types';
import { changeVolume, computeNutritionHash } from './nutrition-utils';
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

export function getFoodPortionId(portion: FoodPortion | FoodPortionCreationDto): string {
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

export function mergeFoodPortions(
   foodPortion1: FoodPortionCreationDto,
   foodPortion2: FoodPortionCreationDto,
): FoodPortionCreationDto {
   switch (foodPortion1.type) {
      case 'product':
         if (foodPortion2.type !== 'product') throw new Error('The food portion types must match');
         if (foodPortion1.product.id !== foodPortion2.product.id)
            throw new Error('The food portions must have the same product');

         const product = foodPortion1.product;
         const maxServingType = getMaxServingType(
            product,
            foodPortion1.servingType,
            foodPortion2.servingType,
            foodPortion1.amount,
            foodPortion2.amount,
         );

         const servingSize = product.servings[maxServingType];
         const mergedAmount =
            (product.servings[foodPortion1.servingType] * foodPortion1.amount +
               product.servings[foodPortion2.servingType] * foodPortion2.amount) /
            servingSize;

         return {
            type: 'product',
            amount: mergedAmount,
            product,
            servingType: maxServingType,
         };

      default:
         throw new Error('not supported');
   }
}

function getMaxServingType(
   product: Product,
   servingType1: string,
   servingType2: string,
   amount1: number,
   amount2: number,
): string {
   const servingSize1 = product.servings[servingType1];
   const servingSize2 = product.servings[servingType2];

   const amountBase1 = servingSize1 * amount1;
   const amountBase2 = servingSize2 * amount2;

   if (servingSize1 > servingSize2 && amountBase2 % servingSize1 === 0) {
      return servingType1;
   }

   if (amountBase1 % servingSize2 === 0) {
      return servingType2;
   }

   if (amountBase2 % servingSize1 === 0) {
      return servingType1;
   }

   return getBaseUnit(product);
}

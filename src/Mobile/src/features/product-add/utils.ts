import _ from 'lodash';
import { NutritionalInfo, Product } from 'src/types';
import { changeVolume } from 'src/utils/nutrition-utils';

export function selectServingType(product: Product, givenAmount?: number, givenServingType?: string): string {
   if (givenServingType !== undefined && product.servings[givenServingType]) {
      return givenServingType;
   }

   if (givenAmount) {
      // findServingTypeThatDividesAmount will always return a serving type, as the serving type g: 1 or ml: 1 must exist
      // in any product
      return findServingTypeThatDividesAmount(product, givenAmount) || product.defaultServing;
   }

   return product.defaultServing;
}

/**
 * try to find the serving type that divides the amount perfectly, select the highest
 * @param product the product
 * @param amount the given amount
 * @returns the serving type
 */
function findServingTypeThatDividesAmount(product: Product, amount: number) {
   return _(Object.keys(product.servings))
      .filter((x) => amount % product.servings[x] === 0)
      .orderBy((x) => product.servings[x], 'desc')
      .first();
}

export type CurveScale = {
   max: number;
   step: number;
   labelStep: number;
};

const maxSelectableCalories = 2000;

const scales = [
   { max: 750, step: 10, labelStep: 50 },
   { max: 500, step: 10, labelStep: 50 },
   { max: 250, step: 5, labelStep: 50 },
   { max: 100, step: 5, labelStep: 10 },
   { max: 50, step: 2, labelStep: 10 },
   { max: 10, step: 1, labelStep: 1 },
   { max: 5, step: 1, labelStep: 1 },
];

export function selectScale(servingVolume: number, nutritionInfo: NutritionalInfo): CurveScale {
   const oneServingNutritions = changeVolume(nutritionInfo, servingVolume);
   for (const scale of scales) {
      if (scale.max * oneServingNutritions.energy <= maxSelectableCalories) {
         return scale;
      }
   }

   return scales[scales.length - 1];
}

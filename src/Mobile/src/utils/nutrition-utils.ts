import _ from 'lodash';
import { NutritionalInfo } from 'src/types';

/**
 * Change the volume of a {@see NutritionalInfo} and calculate the new nutrtional values
 * @param info the nutritional information
 * @param newVolume the new volume
 */
export function changeVolume(info: NutritionalInfo, newVolume: number): NutritionalInfo {
   if (info.volume === 0) throw 'Cannot calculate a new volume if the information are based on a zero volume';

   const factor = newVolume / info.volume;

   return {
      volume: newVolume,
      energy: info.energy * factor,
      fat: info.fat * factor,
      saturatedFat: info.saturatedFat * factor,
      carbohydrates: info.carbohydrates * factor,
      sugars: info.sugars * factor,
      protein: info.protein * factor,
      dietaryFiber: info.dietaryFiber * factor,
      sodium: info.sodium * factor,
   };
}

/**
 * Change the volume of a {@see NutritionalInfo} and calculate the new nutrtional values
 * @param info the nutritional information
 * @param newVolume the new volume
 */
export function sumNutritions(nutritions: NutritionalInfo[]): NutritionalInfo {
   return {
      volume: _.sumBy(nutritions, (x) => x.volume),
      energy: _.sumBy(nutritions, (x) => x.energy),
      fat: _.sumBy(nutritions, (x) => x.fat),
      saturatedFat: _.sumBy(nutritions, (x) => x.saturatedFat),
      carbohydrates: _.sumBy(nutritions, (x) => x.carbohydrates),
      sugars: _.sumBy(nutritions, (x) => x.sugars),
      protein: _.sumBy(nutritions, (x) => x.protein),
      dietaryFiber: _.sumBy(nutritions, (x) => x.dietaryFiber),
      sodium: _.sumBy(nutritions, (x) => x.sodium),
   };
}

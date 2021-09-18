import {
   FoodPortion,
   FoodPortionCreationDto,
   FoodPortionProduct,
   Product,
   ProductFoodPortionCreationDto,
} from 'src/types';
import { changeVolume } from './nutrition-utils';

export function createProductPortionFromCreation(
   creationDto: ProductFoodPortionCreationDto,
   product: Product,
): FoodPortionProduct {
   return {
      type: 'product',
      product: product!,
      amount: creationDto.amount,
      servingType: creationDto.servingType,
      nutritionalInfo: changeVolume(
         product!.nutritionalInfo,
         creationDto.amount * product!.servings[creationDto.servingType],
      ),
   };
}

export function mapFoodPortionDtoCreationDto(foodPortion: FoodPortion): FoodPortionCreationDto {
   switch (foodPortion.type) {
      case 'product':
         return {
            type: 'product',
            amount: foodPortion.amount,
            servingType: foodPortion.servingType,
            product: foodPortion.product,
         };
      case 'meal':
         return {
            type: 'meal',
            mealId: foodPortion.mealId,
            portion: foodPortion.portion,
         };
      case 'custom':
         return {
            type: 'custom',
            label: foodPortion.label,
            nutritionalInfo: foodPortion.nutritionalInfo,
         };
      case 'suggestion':
         return {
            type: 'suggestion',
            suggestionId: foodPortion.suggestionId,
            items: foodPortion.items.map(mapFoodPortionDtoCreationDto),
         };
      default:
         throw 'Unknown type';
   }
}

export function createFoodPortionFromCreationDto(creationDto: FoodPortionCreationDto): FoodPortion {
   switch (creationDto.type) {
      case 'product':
         return {
            type: 'product',
            product: creationDto.product,
            amount: creationDto.amount,
            servingType: creationDto.servingType,
            nutritionalInfo: changeVolume(
               creationDto.product.nutritionalInfo,
               creationDto.amount * creationDto.product.servings[creationDto.servingType],
            ),
         };
      case 'custom':
         return { type: 'custom', nutritionalInfo: creationDto.nutritionalInfo, label: creationDto.label };
      default:
         throw new Error('Not supported');
   }
}

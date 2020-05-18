import { ProductInfo, ProductInfo } from 'Models';

declare module 'Models' {
    export type ConsumptionTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';

    export type FoodPortionType = 'product' | 'meal' | 'suggestion' | 'custom';

    export interface CustomFoodPortionCreationDto {
        type: 'custom';
        label?: string;
        nutritionalInfo: NutritionalInfo;
    }

    export interface MealFoodPortionCreationDto {
        type: 'meal';
        mealId: string;
        portion: number;
        overwriteIngredients?: FoodPortionCreationDto[];
    }

    export interface ProductFoodPortionCreationDto {
        type: 'product';
        productId: string;
        amount: number;
        servingType: string;
    }

    export interface SuggestionFoodPortionCreationDto {
        type: 'suggestion';
        suggestionId: string;
        items: FoodPortionCreationDto[];
    }

    type FoodPortionCreationDto =
        | CustomFoodPortionCreationDto
        | MealFoodPortionCreationDto
        | SuggestionFoodPortionCreationDto
        | ProductFoodPortionCreationDto;

    export interface FoodPortionBase {
        nutritionalInfo: NutritionalInfo;
    }

    export interface FoodPortionCustomDto extends FoodPortionBase {
        type: 'custom';
        label?: string;
    }

    export interface FoodPortionProductDto extends FoodPortionBase {
        type: 'product';
        product: ProductInfo;
        amount: number;
        servingType: string;
    }

    type FoodPortionItemDto = FoodPortionCustomDto | FoodPortionProductDto;

    export interface FoodPortionMealDto extends FoodPortionBase {
        type: 'meal';
        mealId: string;
        portion: number;
        mealName: string;

        items: FoodPortionItemDto[];
    }

    export interface FoodPortionSuggestion extends FoodPortionBase {
        type: 'suggestion';
        suggestionId: string;

        items: FoodPortionDto[];
    }

    export type FoodPortionDto =
        | FoodPortionMealDto
        | FoodPortionProductDto
        | FoodPortionSuggestion
        | FoodPortionCustomDto;

    export interface ConsumedDto {
        date: string;
        time: ConsumptionTime;
        foodPortion: FoodPortionDto;
    }

    export type ProductConsumptionDates = { [date: string]: ConsumedDto[] };
}

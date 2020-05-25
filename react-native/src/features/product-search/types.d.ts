import { NutritionalInfo } from 'Models';

declare module 'Models' {
    type SuggestionType = 'product' | 'meal';

    export interface RecentMealSuggestion {
        time: ConsumptionTime;
        date: string;
    }

    export interface ProductSearchConfig {
        consumptionTime?: ConsumptionTime;
        date?: string;
        filter?: SuggestionType[];
        disableMealCreation?: boolean;
    }

    export interface ProductSuggestion {
        type: 'product';
        product: ProductInfo;

        frequentlyUsedPortion?: FoodPortionProductDto;
    }

    export interface ServingSuggestion extends ServingSize {
        type: 'serving';
        product: ProductInfo;

        frequentlyUsedPortion?: FoodPortionProductDto;
    }

    export interface MealSuggestion {
        type: 'meal';
        mealName: string;
        mealId: string;
        nutritionalInfo: NutritionalInfo;

        frequentlyUsedPortion?: FoodPortionMealDto;
    }

    export interface GeneratedMealSuggestion {
        type: 'generatedMeal';
        id: string;
        items: FoodPortionDto[];
    }

    export interface CustomFoodSuggestion {
        type: 'custom';

        nutritionalInfo: NutritionalInfo;
        label?: string;
    }

    export interface ServingSize {
        /** the amount of the serving type. This may be a base unit (g/ml) or a special serving type (slice, etc.) */
        amount: number;

        /** the serving type */
        servingType: string;

        /** an automatic conversion that took place */
        convertedFrom?: Conversion;
    }

    export interface Conversion {
        /** the name of the conversion, e. g. kg */
        name: string;

        /** the factor that was applied. You can calculate the source amount by 1/factor*amount */
        factor: number;
    }

    export interface ScientificNumber {
        value: number;
        unit: string;
    }

    export type SearchResult =
        | ServingSuggestion
        | ProductSuggestion
        | MealSuggestion
        | GeneratedMealSuggestion
        | CustomFoodSuggestion;
}

declare module 'Models' {
    type SuggestionType = 'product' | 'meal';

    export interface ProductSearchConfig {
        consumptionTime?: ConsumptionTime;
        date?: string;
        filter?: SuggestionType[];
    }

    export interface ProductSuggestion {
        type: 'product';
        product: ProductInfo;
    }

    export interface ServingSuggestion {
        type: 'serving';
        product: ProductInfo;

        amount: number;
        servingType: string;
        convertedFrom?: Conversion;
    }

    export interface MealSuggestion {
        type: 'meal';
        name: string;
        mealId: string;
    }

    export interface GeneratedMealSuggestion {
        type: 'generatedMeal';
        id: string;
        items: FoodPortionDto[];
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

    export type SearchResult = ServingSuggestion | ProductSuggestion | MealSuggestion | GeneratedMealSuggestion;
}

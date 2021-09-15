import { FoodPortion, FoodPortionMeal, FoodPortionProduct, NutritionalInfo, Product } from 'src/types';

export interface Conversion {
   /** the name of the conversion, e. g. kg */
   name: string;

   /** the factor that was applied. You can calculate the source amount by 1/factor*amount */
   factor: number;
}

export interface ServingSize {
   /** the amount of the serving type. This may be a base unit (g/ml) or a special serving type (slice, etc.) */
   amount: number;

   /** the serving type */
   servingType: string;

   /** an automatic conversion that took place */
   convertedFrom?: Conversion;
}

export interface ProductSuggestion {
   type: 'product';
   product: Product;

   frequentlyUsedPortion?: FoodPortionProduct;
}

export interface ServingSuggestion extends ServingSize {
   type: 'serving';
   product: Product;

   frequentlyUsedPortion?: FoodPortionProduct;
}

export interface MealSuggestion {
   type: 'meal';
   mealName: string;
   mealId: string;
   nutritionalInfo: NutritionalInfo;

   frequentlyUsedPortion?: FoodPortionMeal;
}

export interface GeneratedMealSuggestion {
   type: 'generatedMeal';
   id: string;
   items: FoodPortion[];
}

export interface CustomFoodSuggestion {
   type: 'custom';

   nutritionalInfo: NutritionalInfo;
   label?: string;
}

export type SearchResult =
   | ServingSuggestion
   | ProductSuggestion
   | MealSuggestion
   | GeneratedMealSuggestion
   | CustomFoodSuggestion;

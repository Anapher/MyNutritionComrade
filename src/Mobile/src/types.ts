// --------------------- Product ---------------------

export interface ProductLabel {
   value: string;
   tags?: string[] | null;
}

export type ProductLabelList = { [language: string]: ProductLabel };

export type ProductTags = { liquid?: boolean };

export interface ProductEssentials {
   nutritionalInfo: NutritionalInfo;
   tags?: ProductTags;
   label: ProductLabelList;
}

export type ProductServings = { [key: string]: number };

export interface ProductProperties extends ProductEssentials {
   code?: string | null;
   servings: ProductServings;
   defaultServing: string;
}

export interface Product extends ProductProperties {
   id: string;
}

export interface NutritionalInfo {
   volume: number;
   energy: number;
   fat: number;
   saturatedFat: number;
   carbohydrates: number;
   sugars: number;
   protein: number;
   dietaryFiber: number;
   sodium: number;
}

// --------------------- Diary ---------------------
export type ConsumptionTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type FoodPortionType = 'product' | 'meal' | 'suggestion' | 'custom';

export interface FoodPortionCustom {
   type: 'custom';
   label?: string;
   nutritionalInfo: NutritionalInfo;
}

export interface FoodPortionProduct {
   type: 'product';
   product: Product;
   amount: number;
   servingType: string;
}

type FoodPortionItem = FoodPortionCustom | FoodPortionProduct;

export interface FoodPortionMeal {
   type: 'meal';
   mealId: string;
   mealName: string;
   portion: number;

   items: FoodPortionItem[];
}

export interface FoodPortionSuggestion {
   type: 'suggestion';
   suggestionId: string;

   items: FoodPortion[];
}

export type FoodPortion = FoodPortionMeal | FoodPortionProduct | FoodPortionCustom | FoodPortionSuggestion;

export interface ConsumedPortion<T extends FoodPortion = FoodPortion> {
   date: string;
   time: ConsumptionTime;
   foodPortion: T;
}

export interface RecentMealSuggestion {
   time: ConsumptionTime;
   date: string;
}

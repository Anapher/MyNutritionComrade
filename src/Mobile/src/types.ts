// --------------------- Product ---------------------

export interface ProductLabel {
   value: string;
   tags?: string[] | null;
}

export type ProductLabelList = { [language: string]: ProductLabel };

export interface ProductEssentials {
   nutritionalInfo: NutritionalInfo;
   tags?: string[];
   label: ProductLabelList;
}

export interface ProductProperties extends ProductEssentials {
   code?: string | null;
   servings: { [key: string]: number };
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

export interface FoodPortionBase {
   nutritionalInfo: NutritionalInfo;
}

export interface FoodPortionCustom extends FoodPortionBase {
   type: 'custom';
   label?: string;
}

export interface FoodPortionProduct extends FoodPortionBase {
   type: 'product';
   product: Product;
   amount: number;
   servingType: string;
}

type FoodPortionItemDto = FoodPortionCustom | FoodPortionProduct;

export interface FoodPortionMeal extends FoodPortionBase {
   type: 'meal';
   mealId: string;
   portion: number;
   mealName: string;

   items: FoodPortionItemDto[];
}

export interface FoodPortionSuggestion extends FoodPortionBase {
   type: 'suggestion';
   suggestionId: string;

   items: FoodPortion[];
}

export type FoodPortion = FoodPortionMeal | FoodPortionProduct | FoodPortionCustom | FoodPortionSuggestion;

export interface ConsumedPortion {
   date: string;
   time: ConsumptionTime;
   foodPortion: FoodPortion;
}

// --------------------- Food portion creation ---------------------

export interface RecentMealSuggestion {
   time: ConsumptionTime;
   date: string;
}

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

export type FoodPortionCreationDto =
   | CustomFoodPortionCreationDto
   | MealFoodPortionCreationDto
   | ProductFoodPortionCreationDto
   | SuggestionFoodPortionCreationDto;

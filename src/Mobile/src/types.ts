// --------------------- Product ---------------------

export interface ProductLabel {
   value: string;
   tags?: string[] | null;
}

type ProductLabelInfo = { [language: string]: ProductLabel };

export interface ProductEssentials {
   nutritionalInfo: NutritionalInfo;
   tags: string[];
   label: ProductLabelInfo;
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

export type FoodPortion = FoodPortionMeal | FoodPortionProduct | FoodPortionCustom;

export interface ConsumedPortion {
   date: string;
   time: ConsumptionTime;
   foodPortion: FoodPortion;
}

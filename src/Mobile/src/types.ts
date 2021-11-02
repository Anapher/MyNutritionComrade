import { Operation } from 'fast-json-patch';

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

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
   modifiedOn: string;
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

export type FoodPortionItem = FoodPortionCustom | FoodPortionProduct;

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

export type ProductContributionStatusDto = {
   readOnly: boolean;
   openContributions: number;
};

export type ProductContributionStatus = 'pending' | 'applied' | 'rejected';

export type YourVoteDto = { approve: boolean; createdOn: string };
export type ProductContributionStatisticsDto = { totalVotes: number; approveVotes: number };

export type ProductContributionDto = {
   id: string;
   productId: string;
   status: ProductContributionStatus;
   statusDescription?: string;
   operations: Operation[];
   createdOn: string;
   createdByYou: boolean;
   statistics: ProductContributionStatisticsDto;
   yourVote?: YourVoteDto;
};

export type ProductOperationsGroup = {
   operations: Operation[];
};

// --------------------- Meals ---------------------
export type Meal = {
   id: string;
   name: string;
   createdOn: string;

   items: FoodPortionItem[];
};

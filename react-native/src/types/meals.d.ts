declare module 'Models' {
    export interface CreateMealDto {
        name: string;
        items: FoodPortionCreationDto[];
    }

    export interface MealCreationForm {
        name: string;
        items: FoodPortionDto[];
    }

    export interface Meal extends MealCreationForm {
        id: string;
        name: string;
        createdOn: string;
        nutritionalInfo: NutritionalInfo;

        items: FoodPortionItemDto[];
    }
}

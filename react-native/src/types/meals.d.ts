declare module 'Models' {
    export interface CreateMealDto {
        name: string;
        products: CreateMealProductDto[];
    }

    export interface CreateMealProductDto {
        productId: string;
        amount: number;
        servingType: string;
    }

    export interface Meal {
        id: string;
        name: string;
        createdOn: string;
        nutritionInfo: NutritionalInfo;

        consuambles: Consumable[];
    }
}

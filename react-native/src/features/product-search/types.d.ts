declare module 'Models' {
    export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

    export interface FoodSuggestion {
        name: string;
        servingSize?: ServingSize;
        kcal?: number;
    }

    export interface ServingSize {
        size: number;
        unit: string;
        conversion?: Conversion;
    }

    export interface Conversion {
        name: string;
        factor: number;
    }
}

declare module 'Models' {
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

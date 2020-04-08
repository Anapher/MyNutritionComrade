declare module 'Models' {
    export interface FoodSuggestion {
        model: ProductInfo;
        servingSize?: ServingSize;
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

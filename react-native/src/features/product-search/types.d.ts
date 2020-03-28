declare module 'Models' {
    export interface FoodSuggestion {
        model: ProductSearchDto;
        servingSize?: ServingSize;
    }

    export interface ProductSearchDto extends ProductProperties {
        id: string;
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

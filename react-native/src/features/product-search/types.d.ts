declare module 'Models' {
    export interface ProductSuggestion {
        type: 'product';
        product: ProductInfo;
    }

    export interface ServingSuggestion {
        type: 'serving';
        product: ProductInfo;
        servingSize: ServingSize;
    }

    export interface MealSuggestion {
        type: 'meal';
        name: string;
        products: MealProduct2[];
        id: string;
    }

    export interface MealProduct2 {
        product: ProductEssentialsWithId;
        servingSize: ServingSize;
    }

    export interface ServingSize {
        /** the amount of the serving type. This may be a base unit (g/ml) or a special serving type (slice, etc.) */
        amount: number;

        /** the serving type */
        servingType: string;

        /** an automatic conversion that took place */
        convertedFrom?: Conversion;
    }

    export interface Conversion {
        /** the name of the conversion, e. g. kg */
        name: string;

        /** the factor that was applied. You can calculate the source amount by 1/factor*amount */
        factor: number;
    }

    export interface ScientificNumber {
        value: number;
        unit: string;
    }

    export type SearchResult = ServingSuggestion | ProductSuggestion | MealSuggestion;
}

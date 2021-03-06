declare module 'Models' {
    export interface ProductLabel {
        value: string;
        tags: string[];
    }

    type ProductLabelInfo = { [language: string]: ProductLabel };

    export interface ProductEssentials {
        nutritionalInfo: NutritionalInfo;
        tags: string[];
        label: ProductLabelInfo;
    }

    export interface ProductEssentialsWithId extends ProductEssentials {
        id: string;
    }

    export interface ProductProperties extends ProductEssentials {
        code?: string | null;
        servings: { [key: string]: number };
        defaultServing: string;
    }

    export interface ProductInfo extends ProductProperties {
        id: string;
        version: number;
    }

    export interface Product extends ProductInfo {
        contributions: ProductContribution[];

        createdOn: string;
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
}

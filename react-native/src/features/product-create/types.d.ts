declare module 'Models' {
    export interface ProductProperties {
        nutritionInformation: NutritionInformation;
        label: ProductLabel[];
        servings: { [key: string]: number };
        defaultServing: string;
        tags: string[];
    }

    export interface ProductInfo extends ProductProperties {
        code?: string;
    }

    export interface Product extends ProductInfo {
        id: string;
        version: number;

        contributions: ProductContribution[];

        createdOn: string;
        modifiedOn: string;
    }

    export interface ProductContribution {
        id: string;
        userId: string;
        status: 'Pending' | 'Applied' | 'Rejected';
        appliedVersion?: number;
        createdOn: string;
        patch: object;
    }

    export interface ProductLabel {
        languageCode: string;
        value: string;
    }

    export interface NutritionInformation {
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

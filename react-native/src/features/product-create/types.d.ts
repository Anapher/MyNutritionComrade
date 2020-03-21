declare module 'Models' {
    export interface ProductInfo {
        code?: string;
        nutritionInformation: NutritionInformation;
        label: ProductLabel[];
        servings: { [key: string]: number };
        defaultServing: string;
        tags: string[];
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
        label: string;
    }

    export interface NutritionInformation {
        mass: number;
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

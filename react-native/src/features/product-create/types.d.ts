declare module 'Models' {
    export interface ProductEssentials {
        nutritionalInfo: NutritionalInfo;
        tags: string[];
        label: ProductLabel[];
    }

    export interface ProductProperties extends ProductEssentials {
        code?: string | null;
        servings: { [key: string]: number };
        defaultServing: string;
    }

    export interface ProductInfo extends ProductProperties {
        id: string;
    }

    export interface Product extends ProductInfo {
        version: number;

        contributions: ProductContribution[];

        createdOn: string;
        modifiedOn: string;
    }

    export interface ProductContribution {
        id: string;
        userId: string;
        status: 'pending' | 'applied' | 'rejected';
        appliedVersion?: number;
        createdOn: string;
        patch: PatchOperation[];
    }

    export interface ProductLabel {
        languageCode: string;
        value: string;
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

    export interface OpSetProperty {
        type: 'set';
        path: string;
        value: any;
    }

    export interface OpUnsetProperty {
        type: 'unset';
        path: string;
    }

    export interface OpAddItem {
        type: 'add';
        path: string;
        item: any;
    }

    export interface OpRemoveItem {
        type: 'remove';
        path: string;
        item: any;
    }

    export type PatchOperation = OpSetProperty | OpUnsetProperty | OpAddItem | OpRemoveItem;
}

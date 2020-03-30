declare module 'Models' {
    export type ConsumptionTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';

    export interface ProductDto extends ProductInfo {
        id: string;
        version: number;
    }

    export type ConsumedProduct = {
        date: string;
        time: ConsumptionTime;
        productId: string;
        nutritionInformation: NutritionInformation;
        tags: string[];
        label: ProductLabel[];
    };

    export interface FrequentlyUsedProductDto extends ProductDto {
        recentlyConsumedVolume: number;
    }

    export type FrequentlyUsedProducts = { [time in ConsumptionTime]: FrequentlyUsedProductDto[] };
}

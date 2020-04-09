declare module 'Models' {
    export type ConsumptionTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';

    export interface ProductDto extends ProductInfo {
        version: number;
    }

    export interface ConsumedProduct extends ProductEssentials {
        date: string;
        time: ConsumptionTime;
        productId: string;
    }

    export interface FrequentlyUsedProductDto extends ProductDto {
        recentlyConsumedVolume: number;
    }

    export type FrequentlyUsedProducts = { [time in ConsumptionTime]: ?FrequentlyUsedProductDto[] };
}

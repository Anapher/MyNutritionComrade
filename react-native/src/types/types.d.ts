declare module 'Models' {
    export type ConsumptionTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';

    export interface ConsumedProduct extends ProductEssentials {
        date: string;
        time: ConsumptionTime;
        productId: string;
    }

    export type ProductConsumptionDates = { [date: string]: ConsumedProduct[] };

    export interface FrequentlyUsedProductDto extends ProductInfo {
        recentlyConsumedVolume: number;
    }

    export type FrequentlyUsedProducts = { [time in ConsumptionTime]: ?FrequentlyUsedProductDto[] };
}

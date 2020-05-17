declare module 'Models' {
    export interface FrequentlyUsedProductDto extends ProductInfo {
        recentlyConsumedVolume: number;
    }

    export type FrequentlyUsedProducts = { [time in ConsumptionTime]: ?FrequentlyUsedProductDto[] };
}

declare module 'Models' {
    export type FrequentlyUsedProducts = { [time in ConsumptionTime]: ?FoodPortionDto[] };
}

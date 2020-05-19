declare module 'Models' {
    export type FrequentlyConsumed = { [time in ConsumptionTime]: ?FoodPortionDto[] };
}

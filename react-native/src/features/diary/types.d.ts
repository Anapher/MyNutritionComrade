declare module 'Models' {
    export type ConsumptionTime = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

    export type ProductDto = {
        id: string;
        version: number;
    };

    export type ConsumedProduct = {
        day: string;
        time: ConsumptionTime;
        productId: string;
        nutritionInformation: NutritionInformation;
        tags: string[];
    };

    export type FrequentlyUsedProducts = { [time: ConsumptionTime]: ProductDto[] };
}

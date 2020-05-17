import { SearchResult, MealSuggestion, ProductSuggestion, ServingSuggestion, GeneratedMealSuggestion } from 'Models';

export interface ISearchResultHandler<T extends SearchResult> {
    getKey(result: T): string;
}

const handlers: { [key: string]: ISearchResultHandler<any> } = {
    meal: {
        getKey: (result: MealSuggestion) => `meal/${result.mealId}`,
    },
    product: {
        getKey: (result: ProductSuggestion) => `product/${result.product.id}`,
    },
    serving: {
        getKey: (result: ServingSuggestion) =>
            `serving/${result.product.id}/${result.servingType}/${result.amount}/${result.convertedFrom?.name}`,
    },
    generatedMeal: {
        getKey: (result: GeneratedMealSuggestion) => `generatedMeal/${result.id}`,
    },
};

export default handlers;

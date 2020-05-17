import Axios from 'axios';
import { FrequentlyUsedProducts, ComputedNutritionGoals } from 'Models';

export async function loadFrequentlyUsedProducts(): Promise<FrequentlyUsedProducts> {
    return (await Axios.get<FrequentlyUsedProducts>('/api/v1/userservice/frequently_used_products')).data;
}

export async function sumNutritionGoal(): Promise<ComputedNutritionGoals> {
    return (await Axios.get<ComputedNutritionGoals>('/api/v1/userservice/sum_nutrition_goal')).data;
}

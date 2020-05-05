import Axios from 'axios';
import { FrequentlyUsedProducts, ComputedNutritionGoals } from 'Models';

export async function loadFrequentlyUsedProducts(): Promise<FrequentlyUsedProducts> {
    const response = await Axios.get<FrequentlyUsedProducts>('/api/v1/userservice/frequently_used_products');
    return response.data;
}

export async function sumNutritionGoal(): Promise<ComputedNutritionGoals> {
    const response = await Axios.get<ComputedNutritionGoals>('/api/v1/nutritiongoal/sum_nutrition_goal');
    return response.data;
}

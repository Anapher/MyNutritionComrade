import Axios from 'axios';
import { FrequentlyConsumed, ComputedNutritionGoals } from 'Models';

export async function loadFrequentlyConsumed(): Promise<FrequentlyConsumed> {
    return (await Axios.get<FrequentlyConsumed>('/api/v1/userservice/frequently_used')).data;
}

export async function sumNutritionGoal(): Promise<ComputedNutritionGoals> {
    return (await Axios.get<ComputedNutritionGoals>('/api/v1/userservice/sum_nutrition_goal')).data;
}

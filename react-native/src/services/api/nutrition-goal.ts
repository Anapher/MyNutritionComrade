import Axios from 'axios';
import { ComputedNutritionGoals, UserNutritionGoal } from 'Models';

export async function get(): Promise<UserNutritionGoal> {
    const response = await Axios.get<UserNutritionGoal>('/api/v1/nutritiongoal');
    return response.data;
}

export async function sum(): Promise<ComputedNutritionGoals> {
    const response = await Axios.get<ComputedNutritionGoals>('/api/v1/nutritiongoal/sum');
    return response.data;
}

export async function patch(data: Partial<UserNutritionGoal>): Promise<UserNutritionGoal> {
    const response = await Axios.patch<UserNutritionGoal>('/api/v1/nutritiongoal', data);
    return response.data;
}

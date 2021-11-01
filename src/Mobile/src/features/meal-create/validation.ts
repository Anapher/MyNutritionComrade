import { FoodPortionItem } from 'src/types';
import { z } from 'zod';

export const mealSchema = z.object({
   name: z.string().min(1),
   items: z.array(z.object({})).min(1),
});

export type MealForm = {
   name: string;
   items: FoodPortionItem[];
};

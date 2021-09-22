import { NutritionalInfo } from 'src/types';

export type NutritionRow = {
   name: keyof NutritionalInfo;
   unit: string;
   translationKey?: string; // if undefined, use name for translation
   inset?: boolean;
};

export const nutritionalInfo: NutritionRow[] = [
   { name: 'energy', unit: 'kcal' },
   { name: 'fat', unit: 'g' },
   { name: 'saturatedFat', translationKey: 'saturated_fat', inset: true, unit: 'g' },
   { name: 'carbohydrates', unit: 'g' },
   { name: 'sugars', inset: true, unit: 'g' },
   { name: 'dietaryFiber', translationKey: 'dietary_fiber', unit: 'g' },
   { name: 'protein', unit: 'g' },
   { name: 'sodium', unit: 'g' },
];

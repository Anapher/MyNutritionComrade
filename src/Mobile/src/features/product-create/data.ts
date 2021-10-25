import { NutritionalInfo, ProductProperties } from 'src/types';

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

export type ServingInfo = {
   id: string;
   labelKey: string;
   descriptionKey: string;
   predefinedValue?: number;
};

const allServings = (isLiquid: boolean) => ({
   package: {
      id: 'package',
      labelKey: isLiquid ? 'serving_types.bottle' : 'serving_types.package',
      descriptionKey: isLiquid ? 'serving_type_descriptions.bottle' : 'serving_type_descriptions.package',
   },
   portion: { id: 'portion', labelKey: 'serving_types.portion', descriptionKey: 'serving_type_descriptions.portion' },
   cup: {
      id: 'cup',
      labelKey: 'serving_types.cup',
      descriptionKey: 'serving_type_descriptions.cup',
      predefinedValue: isLiquid ? 225 : undefined,
   },
   ts: {
      id: 'ts',
      labelKey: 'serving_types.ts',
      descriptionKey: 'serving_type_descriptions.ts',
      predefinedValue: isLiquid ? 15 : undefined,
   },
   te: {
      id: 'te',
      labelKey: 'serving_types.te',
      descriptionKey: 'serving_type_descriptions.te',
      predefinedValue: isLiquid ? 5 : undefined,
   },
   slice: {
      id: 'slice',
      labelKey: 'serving_types.slice',
      descriptionKey: 'serving_type_descriptions.slice',
      predefinedValue: isLiquid ? 0 : undefined,
   },
   piece: {
      id: 'piece',
      labelKey: 'serving_types.piece',
      descriptionKey: 'serving_type_descriptions.piece',
      predefinedValue: isLiquid ? 0 : undefined,
   },
   bread: {
      id: 'bread',
      labelKey: 'serving_types.bread',
      descriptionKey: 'serving_type_descriptions.bread',
      predefinedValue: isLiquid ? 0 : undefined,
   },
   small: {
      id: 'small',
      labelKey: 'serving_types.small',
      descriptionKey: 'serving_type_descriptions.small',
      predefinedValue: isLiquid ? 30 : undefined,
   },
   medium: {
      id: 'medium',
      labelKey: 'serving_types.medium',
      descriptionKey: 'serving_type_descriptions.medium',
      predefinedValue: isLiquid ? 250 : undefined,
   },
   large: {
      id: 'large',
      labelKey: 'serving_types.large',
      descriptionKey: 'serving_type_descriptions.large',
      predefinedValue: isLiquid ? 400 : undefined,
   },
   extraLarge: {
      id: 'extraLarge',
      labelKey: 'serving_types.extraLarge',
      descriptionKey: 'serving_type_descriptions.extraLarge',
      predefinedValue: isLiquid ? 500 : undefined,
   },
});

export type ServingType = keyof ReturnType<typeof allServings>;

export const getServings: (isLiquid: boolean) => { [name in ServingType]: ServingInfo } = allServings;

export const emptyProduct: ProductProperties = {
   defaultServing: 'g',
   nutritionalInfo: {
      volume: 100,
      energy: 0,
      fat: 0,
      saturatedFat: 0,
      carbohydrates: 0,
      sugars: 0,
      protein: 0,
      dietaryFiber: 0,
      sodium: 0,
   },
   servings: {
      g: 1,
   },
   label: {},
};

export const baseUnits = ['g', 'ml'];

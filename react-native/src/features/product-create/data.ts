import { NutritionalInfo, ProductProperties } from 'Models';
import { CurrentLanguage, SupportedLanguages } from 'src/consts';
import * as yup from 'yup';

export type NutritionRow = {
    name: keyof NutritionalInfo;
    label: string;
    unit: string;
    inset?: boolean;
};

export type ServingInfo = {
    id: string;
    label: string;
    description: string;
    predefinedValue?: number;
};

export const nutritionalInfo: NutritionRow[] = [
    { name: 'energy', label: 'Energy', unit: 'kcal' },
    { name: 'fat', label: 'Fat', unit: 'g' },
    { name: 'saturatedFat', label: 'Saturated Fat', inset: true, unit: 'g' },
    { name: 'carbohydrates', label: 'Carbohydrates', unit: 'g' },
    { name: 'dietaryFiber', label: 'Dietary Fiber', inset: true, unit: 'g' },
    { name: 'sugars', label: 'Sugars', inset: true, unit: 'g' },
    { name: 'protein', label: 'Protein', unit: 'g' },
    { name: 'sodium', label: 'Sodium', unit: 'g' },
];

const servings = (isLiquid: boolean) => ({
    package: {
        id: 'package',
        label: isLiquid ? 'Bottle' : 'Package',
        description: `The size of the ${isLiquid ? 'bottle' : 'package'} when you buy the product.`,
    },
    portion: { id: 'portion', label: 'Portion', description: 'One suggested portition.' },

    cup: {
        id: 'cup',
        label: 'Cup',
        description: 'One Cup (225ml) of the product.',
        predefinedValue: isLiquid ? 225 : undefined,
    },
    ts: {
        id: 'ts',
        label: 'Table Spoon',
        description: 'One table spoon (15ml) of the product.',
        predefinedValue: isLiquid ? 15 : undefined,
    },
    te: {
        id: 'te',
        label: 'Tea Spoon',
        description: 'One tea spoon (5ml) of the product.',
        predefinedValue: isLiquid ? 5 : undefined,
    },
    slice: {
        id: 'slice',
        label: 'Slice',
        description: 'One slice of the product (e. g. applicable for sliced cheese)',
        predefinedValue: isLiquid ? 0 : undefined,
    },
    piece: {
        id: 'piece',
        label: 'Piece',
        description: 'One piece of the product (e. g. applicable for gummy bears)',
        predefinedValue: isLiquid ? 0 : undefined,
    },
    bread: {
        id: 'bread',
        label: 'Bread',
        description: 'How much you use when you eat one bread with this product (e. g. applicable for cream cheese).',
        predefinedValue: isLiquid ? 0 : undefined,
    },

    small: {
        id: 'small',
        label: 'Small',
        description: 'One small unit of this product (e. g. one small potato)',
        predefinedValue: isLiquid ? 30 : undefined,
    },
    medium: {
        id: 'medium',
        label: 'Medium',
        description: 'One small unit of this product (e. g. one M egg)',
        predefinedValue: isLiquid ? 250 : undefined,
    },
    large: {
        id: 'large',
        label: 'Large',
        description: 'One small unit of this product (e. g. one L egg)',
        predefinedValue: isLiquid ? 400 : undefined,
    },
    extraLarge: {
        id: 'extraLarge',
        label: 'Extra Large',
        description: 'One small unit of this product (e. g. one XL egg)',
        predefinedValue: isLiquid ? 500 : undefined,
    },
});

export const getServings: (
    isLiquid: boolean,
) => { [name in keyof ReturnType<typeof servings>]: ServingInfo } = servings;

export const emptyProductInfo: ProductProperties = {
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
    tags: [],
    label: [{ languageCode: CurrentLanguage, value: '' }],
    servings: {
        g: 1,
    },
    code: null,
};

const nutritionalValue = yup.number().min(0).required();

export const productInfoValidationSchema = yup.object().shape({
    label: yup
        .array()
        .of(
            yup.object().shape({
                languageCode: yup
                    .string()
                    .required()
                    .oneOf(SupportedLanguages.map((x) => x.twoLetterCode)),
                value: yup.string().required('The label is required.'),
            }),
        )
        .min(1, 'Please provide at least one label.'),
    defaultServing: yup
        .string()
        .required()
        .test('defaultServingHasValue', 'The default serving must have a value', function (value) {
            const { servings } = this.parent;
            return !!servings[value];
        }),
    nutritionalInfo: yup.object().shape({
        volume: yup
            .number()
            .oneOf([100])
            .required()
            .test('max', 'Total nutritions must not exceed 100g', function (value) {
                const { volume, fat, carbohydrates, protein, sodium } = this.parent;
                return fat + carbohydrates + protein + sodium <= volume;
            }),
        energy: nutritionalValue.min(1),
        fat: nutritionalValue,
        saturatedFat: nutritionalValue.test('max', 'Saturated Fat must not exceed total fat', function (value) {
            const { fat } = this.parent;
            return fat >= value;
        }),
        carbohydrates: nutritionalValue,
        sugars: nutritionalValue.test('max', 'Sugars must not exceed total carbohydrates', function (value) {
            const { carbohydrates } = this.parent;
            return carbohydrates >= value;
        }),
        protein: nutritionalValue,
        dietaryFiber: nutritionalValue,
        sodium: nutritionalValue,
    }),
    tags: yup.array().of(yup.string()),
    code: yup.string().nullable(),
    servings: yup.lazy((value: any) =>
        yup.object().shape(Object.fromEntries(Object.keys(value).map((x) => [x, yup.number().positive()]))),
    ),
});

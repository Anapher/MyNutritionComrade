import * as yup from 'yup';
import { SupportedLanguages } from 'src/consts';

const nutritionalValue = yup.number().min(0).required();

const productInfoValidationSchema = yup.object().shape({
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

export default productInfoValidationSchema;

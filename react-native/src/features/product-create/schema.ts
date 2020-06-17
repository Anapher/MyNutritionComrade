import * as yup from 'yup';
import { SupportedLanguages } from 'src/consts';

const nutritionalValue = yup
    .number()
    .min(0, 'This value must be greater or equal to 1.')
    .required('This value is required.');

const productInfoValidationSchema = yup.object().shape({
    label: yup.lazy((value: any) => {
        return yup
            .object()
            .shape(
                Object.fromEntries(
                    Object.keys(value).map((x) => [
                        x,
                        yup.object().shape({
                            value: yup.string().required('This value is required.'),
                            tags: yup
                                .array()
                                .of(yup.string())
                                .test('notEmpty', 'Empty tags are not allowed', function (value: string[]) {
                                    return value.findIndex((x) => !x) === -1;
                                })
                                .test('unique', 'Duplicate tags are not allowed.', function (value: string[]) {
                                    return value.length === new Set(value.map((x) => x?.toLowerCase())).size;
                                }),
                        }),
                    ]),
                ),
            )
            .test('At least one label', 'Please provide at least one label.', function (value) {
                return Object.keys(value).length > 0;
            })
            .test('Valid language codes', 'All label keys must be valid language codes.', function (value) {
                return !Object.keys(value).find((x) => !SupportedLanguages.find((y) => y.twoLetterCode === x));
            });
    }),
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
        energy: nutritionalValue.min(1, 'The energy must be greater or equal to 1.'),
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

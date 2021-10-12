import { ProductLabelList } from 'src/types';
import { z } from 'zod';

const schema = z.object({
   code: z.string().min(1).optional(),
   label: z
      .preprocess(
         (val) => Object.entries(val as ProductLabelList).map(([lang, value]) => ({ ...value, lang })),
         z
            .object({
               value: z.string().min(1),
               tags: z.string().array().optional(),
               lang: z.string().length(2),
            })
            .array()
            .nonempty(),
      )
      .transform((val) => Object.fromEntries(val.map((x) => [x.lang, { tags: x.tags, value: x.value }]))),
   defaultServing: z.string().min(1),
   servings: z.record(z.number().min(1).optional()),
   nutritionalInfo: z
      .object({
         volume: z.literal(100),
         energy: z.number().min(1),
         fat: z.number().min(0),
         saturatedFat: z.number().min(0),
         carbohydrates: z.number().min(0),
         sugars: z.number().min(0),
         protein: z.number().min(0),
         dietaryFiber: z.number().min(0),
         sodium: z.number().min(0),
      })
      .refine((val) => val.saturatedFat === undefined || val.fat === undefined || val.saturatedFat <= val.fat, {
         message: 'Saturated fat must not exceed total fat',
         path: ['saturatedFat'],
      })
      .refine((val) => val.sugars === undefined || val.carbohydrates === undefined || val.sugars <= val.carbohydrates, {
         message: 'Sugars must not exceed total carbohydrates',
         path: ['sugars'],
      })
      .refine(
         (val) =>
            val.fat === undefined ||
            val.carbohydrates === undefined ||
            val.protein === undefined ||
            val.dietaryFiber === undefined ||
            val.sodium === undefined ||
            val.fat + val.carbohydrates + val.protein + val.dietaryFiber + val.sodium <= 100,
         { message: 'The sum of the nutritions must not exceed 100g', path: ['volume'] },
      ),
});

export default schema;

type Product = z.infer<typeof schema>;

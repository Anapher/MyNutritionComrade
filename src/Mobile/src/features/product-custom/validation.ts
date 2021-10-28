import { NutritionalInfo } from 'src/types';
import { z } from 'zod';
import { nutritionalInfoSchema } from '../product-create/validation';

export const schema = z.object({
   label: z.string().optional(),
   nutritionalInfo: z.preprocess(
      (x) => Object.fromEntries(Object.entries(x as NutritionalInfo).map(([key, value]) => [key, value || 0])),
      nutritionalInfoSchema,
   ),
   type: z.literal('custom'),
});

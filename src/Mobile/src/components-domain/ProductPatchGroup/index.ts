import { Operation } from 'fast-json-patch';
import { TFunction } from 'i18next';
import { ProductProperties } from 'src/types';
import patchCode from './patch-code';
import patchDefaultServing from './patch-default-serving';
import patchLabel from './patch-label';
import patchNutritionalInfo from './patch-nutritional-info';
import patchServing from './patch-serving';
import patchTagLiquid from './patch-tag-liquid';
import { isOperationChanging, isOperationItem, PatchView } from './utils';

export default function getPatchView(
   operations: Operation[],
   currentProduct: ProductProperties,
   t: TFunction,
): PatchView {
   if (operations.find((x) => isOperationItem(x, 'nutritionalInfo'))) {
      return patchNutritionalInfo(operations, currentProduct, t);
   }

   if (operations.find((x) => isOperationChanging(x, 'tags.liquid'))) {
      return patchTagLiquid(operations);
   }

   if (operations.find((x) => isOperationChanging(x, 'defaultServing'))) {
      return patchDefaultServing(operations, currentProduct, t);
   }

   if (operations.length === 1) {
      const operation = operations[0];

      if (isOperationChanging(operation, 'code')) {
         return patchCode(operation, currentProduct, t);
      }

      if (isOperationItem(operation, 'servings')) {
         return patchServing(operation, currentProduct, t);
      }

      if (isOperationItem(operation, 'label')) {
         return patchLabel(operation, currentProduct, t);
      }
   }

   throw new Error('Unknown operations');
}

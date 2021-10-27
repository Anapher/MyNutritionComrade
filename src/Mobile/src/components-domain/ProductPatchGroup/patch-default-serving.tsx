import { Operation } from 'fast-json-patch';
import { TFunction } from 'i18next';
import React from 'react';
import { View } from 'react-native';
import { ProductProperties } from 'src/types';
import ValuePatch from '../ValuePatch';
import patchServing from './patch-serving';
import { isOperationChanging, isOperationItem, PatchView } from './utils';

export default function patchDefaultServing(
   operations: Operation[],
   currentProduct: ProductProperties,
   t: TFunction,
): PatchView {
   const defaultServingOp = operations.find((x) => isOperationChanging(x, 'defaultServing'))!;
   const addServingOp = operations.find((x) => isOperationItem(x, 'servings'));

   return {
      type: 'modify',
      title: t('product_properties.default_serving'),
      view: (
         <View>
            <ValuePatch operation={defaultServingOp} currentValue={currentProduct.defaultServing} />
            {addServingOp && patchServing(addServingOp, currentProduct, t).view}
         </View>
      ),
   };
}

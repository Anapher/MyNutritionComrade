import { Operation } from 'fast-json-patch';
import React from 'react';
import { View } from 'react-native';
import { isOperationChanging, PatchView } from './utils';

export default function patchTagLiquid(operations: Operation[]): PatchView {
   const liquidTagOperation = operations.find((x) => isOperationChanging(x, 'tags.liquid'))!;

   const productBecomesLiquid =
      (liquidTagOperation.op === 'add' || liquidTagOperation.op === 'replace') && liquidTagOperation.value;

   return {
      type: 'modify',
      title: productBecomesLiquid ? 'Redefine product as liquid' : 'Redefine product as non liquid',
      view: <View />,
   };
}

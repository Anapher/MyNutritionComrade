import { Operation } from 'fast-json-patch';
import { TFunction } from 'i18next';
import React from 'react';
import { ProductProperties } from 'src/types';
import ValuePatch from '../ValuePatch';
import { getPropertyOperationType, PatchView } from './utils';

export default function patchCode(operation: Operation, currentProduct: ProductProperties, t: TFunction): PatchView {
   return {
      type: getPropertyOperationType(operation, currentProduct.code),
      title: t('product_properties.barcode'),
      view: <ValuePatch operation={operation} currentValue={currentProduct.code || undefined} />,
   };
}

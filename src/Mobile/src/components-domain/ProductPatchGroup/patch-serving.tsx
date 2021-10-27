import { Operation } from 'fast-json-patch';
import { TFunction } from 'i18next';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { getServings, ServingType } from 'src/features/product-create/data';
import { ProductProperties } from 'src/types';
import { getBaseUnit } from 'src/utils/product-utils';
import ValuePatch from '../ValuePatch';
import { getPropertyOperationType, PatchView } from './utils';

export default function patchServing(operation: Operation, currentProduct: ProductProperties, t: TFunction): PatchView {
   const servingType = operation.path.substring(operation.path.lastIndexOf('/') + 1) as ServingType;
   const servings = getServings(Boolean(currentProduct.tags?.liquid));
   const baseUnit = getBaseUnit(currentProduct);

   const servingInfo = servings[servingType];

   return {
      type: getPropertyOperationType(operation, currentProduct.servings[servingType]),
      title: t('product_properties.servings'),
      view: (
         <View style={styles.line}>
            <Text>{t(servingInfo.labelKey)}: </Text>
            <ValuePatch
               operation={operation}
               currentValue={currentProduct.servings[servingType]}
               formatValue={(x) => x + baseUnit}
            />
         </View>
      ),
   };
}

const styles = StyleSheet.create({
   line: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
   },
});

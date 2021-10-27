import { Operation } from 'fast-json-patch';
import { TFunction } from 'i18next';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import SettingsReadOnlyKeyValue from 'src/components/Settings/Items/SettingsReadOnlyKeyValue';
import { SettingsItem } from 'src/components/Settings/SettingsList';
import SettingsView from 'src/components/Settings/SettingsView';
import { nutritionalInfo, NutritionRow } from 'src/features/product-create/data';
import { ProductProperties } from 'src/types';
import { formatNutritionalValue } from 'src/utils/product-utils';
import ValuePatch from '../ValuePatch';
import { PatchView } from './utils';

export default function patchNutritionalInfo(
   operations: Operation[],
   currentProduct: ProductProperties,
   t: TFunction,
): PatchView {
   return {
      type: 'modify',
      title: t('product_properties.nutritional_values'),
      view: <SettingsView settings={nutritionalInfo.map((x) => getNutritionRow(x, operations, currentProduct, t))} />,
   };
}

function getNutritionRow(
   { name, translationKey, inset, unit }: NutritionRow,
   operations: Operation[],
   currentProduct: ProductProperties,
   t: TFunction,
): SettingsItem {
   const operation = operations.find((x) => x.path.endsWith(name));
   const currentValue = currentProduct.nutritionalInfo[name];
   const formatValue = (n: number) => formatNutritionalValue(n, unit);

   return {
      key: name,
      render: () => (
         <SettingsReadOnlyKeyValue
            title={t(`nutritional_info.${translationKey || name}`)}
            titleStyle={[inset ? styles.textInset : undefined]}
         >
            {operation ? (
               <ValuePatch
                  operation={operation}
                  currentValue={currentValue}
                  formatValue={formatValue}
                  textStyle={styles.valueText}
               />
            ) : (
               <Text style={styles.valueText}>{formatValue(currentValue)}</Text>
            )}
         </SettingsReadOnlyKeyValue>
      ),
   };
}

const styles = StyleSheet.create({
   textInset: {
      marginLeft: 16,
      marginRight: -8,
   },
   valueText: {
      fontSize: 16,
   },
});

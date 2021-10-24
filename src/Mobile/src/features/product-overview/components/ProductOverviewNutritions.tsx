import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import SettingsReadOnlyKeyValue from 'src/components/Settings/Items/SettingsReadOnlyKeyValue';
import SettingsHeader from 'src/components/Settings/SettingsHeader';
import { SettingsSection } from 'src/components/Settings/SettingsList';
import { nutritionalInfo } from 'src/features/product-create/data';
import { Product } from 'src/types';
import { getBaseUnit } from 'src/utils/product-utils';

export default function ProductOverviewNutritions(product: Product): SettingsSection {
   const baseUnit = getBaseUnit(product);
   const { t } = useTranslation();

   return {
      renderHeader: () => (
         <SettingsHeader label={t('create_product.average_nutritional_values', { base: `100${baseUnit}` })} />
      ),
      settings: nutritionalInfo.map(({ name, translationKey, unit, inset }) => ({
         key: name,
         render: () => (
            <SettingsReadOnlyKeyValue
               title={t(`nutritional_info.${translationKey || name}`)}
               titleStyle={[inset ? styles.textInset : undefined]}
            >
               {product.nutritionalInfo[name] + ' ' + unit}
            </SettingsReadOnlyKeyValue>
         ),
      })),
   };
}

const styles = StyleSheet.create({
   labelItemContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginVertical: 8,
      alignItems: 'center',
   },
   textInset: {
      marginLeft: 16,
      marginRight: -8,
   },
});

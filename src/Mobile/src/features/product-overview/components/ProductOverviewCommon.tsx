import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import SettingsReadOnlyKeyValue from 'src/components/Settings/Items/SettingsReadOnlyKeyValue';
import SettingsHeader from 'src/components/Settings/SettingsHeader';
import { SettingsSection } from 'src/components/Settings/SettingsList';
import { Product } from 'src/types';
import { getBaseUnit } from 'src/utils/product-utils';

export default function ProductOverviewCommon(product: Product): SettingsSection {
   const { t } = useTranslation();
   // const baseUnit = getBaseUnit(product);

   return {
      renderHeader: () => <SettingsHeader label={t('product_properties')} />,
      settings: [
         // {
         //    key: 'baseUnit',
         //    render: () => (
         //       <SettingsReadOnlyKeyValue title={t('create_product.base_unit')}>{baseUnit}</SettingsReadOnlyKeyValue>
         //    ),
         // },
         {
            key: 'code',
            render: () => (
               <SettingsReadOnlyKeyValue title={t('create_product.barcode')}>
                  <Text style={[styles.codeValueText, product.code ? undefined : styles.codeNotSet]}>
                     {product.code || t<string>('settings.not_set')}
                  </Text>
               </SettingsReadOnlyKeyValue>
            ),
         },
      ],
   };
}

const styles = StyleSheet.create({
   codeValueText: {
      fontSize: 16,
   },
   codeNotSet: {
      opacity: 0.5,
   },
});

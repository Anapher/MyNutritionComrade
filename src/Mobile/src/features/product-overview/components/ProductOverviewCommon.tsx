import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import SettingsReadOnlyKeyValue from 'src/components/Settings/Items/SettingsReadOnlyKeyValue';
import SettingsHeader from 'src/components/Settings/SettingsHeader';
import { SettingsSection } from 'src/components/Settings/SettingsList';
import { Product } from 'src/types';

export default function ProductOverviewCommon(product: Product): SettingsSection {
   const { t } = useTranslation();

   return {
      renderHeader: () => <SettingsHeader label={t('properties')} />,
      settings: [
         {
            key: 'code',
            render: () => (
               <SettingsReadOnlyKeyValue title={t('product_properties.barcode')}>
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

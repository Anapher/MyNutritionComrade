import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ActionHeader, ActionListItem, ActionListSection, ReadOnlyKeyValue } from 'src/components/ActionList';
import { Product } from 'src/types';

export default function ProductOverviewCommon(product: Product) {
   const { t } = useTranslation();

   return (
      <ActionListSection name="common" renderHeader={() => <ActionHeader label={t('properties')} />}>
         <ActionListItem
            name="code"
            render={() => (
               <ReadOnlyKeyValue title={t('product_properties.barcode')}>
                  <Text style={[styles.codeValueText, product.code ? undefined : styles.codeNotSet]}>
                     {product.code || t<string>('settings.not_set')}
                  </Text>
               </ReadOnlyKeyValue>
            )}
         />
      </ActionListSection>
   );
}

const styles = StyleSheet.create({
   codeValueText: {
      fontSize: 16,
   },
   codeNotSet: {
      opacity: 0.5,
   },
});

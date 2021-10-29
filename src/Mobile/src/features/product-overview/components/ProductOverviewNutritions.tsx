import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ActionHeader, ActionListItem, ActionListSection, ReadOnlyKeyValue } from 'src/components/ActionList';
import { nutritionalInfo } from 'src/features/product-create/data';
import { Product } from 'src/types';
import { formatNutritionalValue, getBaseUnit } from 'src/utils/product-utils';

export default function ProductOverviewNutritions(product: Product) {
   const baseUnit = getBaseUnit(product);
   const { t } = useTranslation();

   return (
      <ActionListSection
         name="nutritional-values"
         renderHeader={() => (
            <ActionHeader label={t('create_product.average_nutritional_values', { base: `100${baseUnit}` })} />
         )}
      >
         {nutritionalInfo.map(({ name, translationKey, unit, inset }) => (
            <ActionListItem
               name={name}
               key={name}
               render={() => (
                  <ReadOnlyKeyValue
                     title={t(`nutritional_info.${translationKey || name}`)}
                     titleStyle={[inset ? styles.textInset : undefined]}
                  >
                     {formatNutritionalValue(product.nutritionalInfo[name], unit)}
                  </ReadOnlyKeyValue>
               )}
            />
         ))}
      </ActionListSection>
   );
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

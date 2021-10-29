import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionHeader, ActionListItem, ActionListSection, ReadOnlyKeyValue } from 'src/components/ActionList';
import { baseUnits, getServings } from 'src/features/product-create/data';
import { Product } from 'src/types';
import { formatNutritionalValue, getBaseUnit } from 'src/utils/product-utils';

export default function ProductOverviewServings(product: Product) {
   const { t } = useTranslation();
   const baseUnit = getBaseUnit(product);
   const isLiquid = Boolean(product.tags?.liquid);

   return (
      <ActionListSection name="serving" renderHeader={() => <ActionHeader label={t('product_properties.servings')} />}>
         {Object.entries(product.servings)
            .filter(([key, value]) => value && !baseUnits.includes(key))
            .map(([key, value]) => (
               <ActionListItem
                  name={key}
                  key={key}
                  render={() => (
                     <ReadOnlyKeyValue title={t((getServings(isLiquid) as any)[key].labelKey)}>
                        {formatNutritionalValue(value, baseUnit)}
                     </ReadOnlyKeyValue>
                  )}
               />
            ))}
      </ActionListSection>
   );
}

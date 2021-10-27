import React from 'react';
import { useTranslation } from 'react-i18next';
import SettingsReadOnlyKeyValue from 'src/components/Settings/Items/SettingsReadOnlyKeyValue';
import SettingsHeader from 'src/components/Settings/SettingsHeader';
import { SettingsItem, SettingsSection } from 'src/components/Settings/SettingsList';
import { baseUnits, getServings } from 'src/features/product-create/data';
import { Product } from 'src/types';
import { formatNutritionalValue, getBaseUnit } from 'src/utils/product-utils';

export default function ProductOverviewServings(product: Product): SettingsSection {
   const { t } = useTranslation();
   const baseUnit = getBaseUnit(product);
   const isLiquid = Boolean(product.tags?.liquid);

   return {
      renderHeader: () => <SettingsHeader label={t('product_properties.servings')} />,
      settings: Object.entries(product.servings)
         .filter(([key, value]) => value && !baseUnits.includes(key))
         .map<SettingsItem>(([key, value]) => ({
            key,
            render: () => (
               <SettingsReadOnlyKeyValue title={t((getServings(isLiquid) as any)[key].labelKey)}>
                  {formatNutritionalValue(value, baseUnit)}
               </SettingsReadOnlyKeyValue>
            ),
         })),
   };
}

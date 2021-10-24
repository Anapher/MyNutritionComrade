import React from 'react';
import SettingItem from 'src/components/Settings/SettingItem';
import { SettingsSection } from 'src/components/Settings/SettingsList';
import { Product, ProductLabel } from 'src/types';

export default function ProductOverviewLabels(product: Product): SettingsSection {
   return {
      settings: Object.entries(product.label).map(([lang, data]) => ({ key: lang, render: () => <SettingItem /> })),
   };
}

function LabelSettingItem(lang: string, label: ProductLabel) {}

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import SettingsList from 'src/components/Settings/SettingsList';
import { ProductProperties } from 'src/types';
import ProductCommonSection from './ProductCommonSection';
import ProductLabelSection from './ProductLabelSection';
import ProductNutritionalValuesSection from './ProductNutritionalValuesSection';

type Props = {
   form: UseFormReturn<ProductProperties>;
};

export default function ProductEditor({ form }: Props) {
   return (
      <SettingsList
         settings={[ProductLabelSection(form), ProductCommonSection(form), ProductNutritionalValuesSection(form)]}
      />
   );
}

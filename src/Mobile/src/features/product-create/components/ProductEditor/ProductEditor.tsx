import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ActionList } from 'src/components/ActionList';
import { ProductProperties } from 'src/types';
import ProductCommonSection from './ProductCommonSection';
import ProductLabelSection from './ProductLabelSection';
import ProductNutritionalValuesSection from './ProductNutritionalValuesSection';
import ProductServingsSection from './ProductServingsSection';

type Props = {
   form: UseFormReturn<ProductProperties>;
};

export default function ProductEditor({ form }: Props) {
   return (
      <ActionList>
         {ProductLabelSection(form)}
         {ProductCommonSection(form)}
         {ProductNutritionalValuesSection(form)}
         {ProductServingsSection(form)}
      </ActionList>
   );
}

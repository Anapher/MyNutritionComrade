import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import {
   ActionButtonLink,
   ActionHeader,
   ActionListItem,
   ActionListSection,
   ActionNumberInput,
} from 'src/components/ActionList';
import useActionSheetWrapper, { CancelButton, SheetButton } from 'src/hooks/useActionSheetWrapper';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ProductProperties } from 'src/types';
import { formatNutritionalValue, getBaseUnit } from 'src/utils/product-utils';
import { baseUnits, getServings } from '../../data';

export default function ProductServingsSection(form: UseFormReturn<ProductProperties>) {
   const theme = useTheme();
   const { t } = useTranslation();
   const { watch, setValue, control } = form;
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
   const servings = watch('servings');
   const tags = watch('tags');

   const showActionSheet = useActionSheetWrapper();

   const isLiquid = Boolean(tags?.liquid);
   const baseUnit = getBaseUnit(tags);

   const servingToString = (key: string) =>
      key === baseUnit ? baseUnit : t((getServings(isLiquid) as any)[key].labelKey);

   const handleSelectDefaultServing = () => {
      showActionSheet([
         ...Object.entries(servings)
            .filter(([, value]) => value)
            .map<SheetButton>(([key, value]) => ({
               label: `${servingToString(key)} (${formatNutritionalValue(value, baseUnit)})`,
               onPress: () => setValue('defaultServing', key),
            })),
         CancelButton(),
      ]);
   };

   return (
      <ActionListSection name="servings" renderHeader={() => <ActionHeader label={t('product_properties.servings')} />}>
         {Object.entries(servings)
            .filter(([key, value]) => value && !baseUnits.includes(key))
            .map(([key, value]) => (
               <ActionListItem
                  key={key}
                  name={key}
                  render={() => (
                     <ActionNumberInput
                        value={value}
                        onChangeValue={(v) => form.setValue(`servings.${key}`, v as any)}
                        title={servingToString(key)}
                     />
                  )}
               />
            ))}
         <ActionListItem
            name="add"
            render={() => (
               <ActionButtonLink
                  title={t('create_product.add_servings')}
                  onPress={() => navigation.push('ProductEditorServings', { form })}
                  textStyles={{ color: theme.colors.primary }}
                  icon="arrow"
               />
            )}
         />
         <ActionListItem
            name="default"
            render={() => (
               <Controller
                  control={control}
                  name="defaultServing"
                  render={({ field: { value }, fieldState: { error } }) => (
                     <ActionButtonLink
                        title={t('product_properties.default_serving')}
                        onPress={handleSelectDefaultServing}
                        textStyles={{ color: error ? theme.colors.error : theme.colors.primary }}
                        icon="arrow"
                        secondary={servingToString(value)}
                     />
                  )}
               />
            )}
         />
      </ActionListSection>
   );
}

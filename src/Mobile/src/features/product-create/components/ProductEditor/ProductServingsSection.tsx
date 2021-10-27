import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, useTheme } from 'react-native-paper';
import SettingsButtonLink from 'src/components/Settings/Items/SettingsButtonLink';
import SettingsHeader from 'src/components/Settings/SettingsHeader';
import { SettingsItem, SettingsSection } from 'src/components/Settings/SettingsList';
import SettingsNumberInput from 'src/components/Settings/Items/SettingsNumberInput';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ProductProperties } from 'src/types';
import { baseUnits, getServings } from '../../data';
import { formatNutritionalValue, getBaseUnit } from 'src/utils/product-utils';
import useActionSheetWrapper, { CancelButton, SheetButton } from 'src/hooks/useActionSheetWrapper';

export default function ProductServingsSection(form: UseFormReturn<ProductProperties>): SettingsSection {
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

   return {
      renderHeader: () => <SettingsHeader label={t('create_product.servings')} />,
      settings: [
         ...Object.entries(servings)
            .filter(([key, value]) => value && !baseUnits.includes(key))
            .map<SettingsItem>(([key, value]) => ({
               key,
               render: () => (
                  <SettingsNumberInput
                     value={value}
                     onChangeValue={(v) => form.setValue(`servings.${key}`, v as any)}
                     title={servingToString(key)}
                  />
               ),
            })),
         {
            key: 'add',
            render: () => (
               <SettingsButtonLink
                  title={t('create_product.add_servings')}
                  onPress={() => navigation.push('ProductEditorServings', { form })}
                  textStyles={{ color: theme.colors.primary }}
                  icon="arrow"
               />
            ),
         },
         {
            key: 'default',
            render: () => (
               <Controller
                  control={control}
                  name="defaultServing"
                  render={({ field: { value }, fieldState: { error } }) => (
                     <SettingsButtonLink
                        title={t('product_properties.default_serving')}
                        onPress={handleSelectDefaultServing}
                        textStyles={{ color: error ? theme.colors.error : theme.colors.primary }}
                        icon="arrow"
                        secondary={servingToString(value)}
                     />
                  )}
               />
            ),
         },
      ],
   };
}

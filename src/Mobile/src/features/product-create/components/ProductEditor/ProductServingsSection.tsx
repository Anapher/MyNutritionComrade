import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import SettingsButtonLink from 'src/components/Settings/Items/SettingsButtonLink';
import SettingsHeader from 'src/components/Settings/SettingsHeader';
import { SettingsItem, SettingsSection } from 'src/components/Settings/SettingsList';
import SettingsNumberInput from 'src/components/Settings/Items/SettingsNumberInput';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ProductProperties } from 'src/types';
import { baseUnits, getServings } from '../../data';

export default function ProductServingsSection(form: UseFormReturn<ProductProperties>): SettingsSection {
   const theme = useTheme();
   const { t } = useTranslation();
   const { watch } = form;
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
   const servings = watch('servings');

   const tags = watch('tags');
   const isLiquid = Boolean(tags?.liquid);

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
                     title={t((getServings(isLiquid) as any)[key].labelKey)}
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
      ],
   };
}

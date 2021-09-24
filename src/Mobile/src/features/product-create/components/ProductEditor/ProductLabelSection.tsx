import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import SettingsButtonLink from 'src/components/Settings/SettingsButtonLink';
import SettingsHeader from 'src/components/Settings/SettingsHeader';
import { SettingsItem, SettingsSection } from 'src/components/Settings/SettingsList';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ProductLabel, ProductProperties } from 'src/types';

const supportedLanguages = ['de', 'en'];

export default function ProductLabelSection({ setValue, watch }: UseFormReturn<ProductProperties>): SettingsSection {
   const theme = useTheme();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
   const label = watch('label');
   const { t } = useTranslation();

   const handleAddLabel = () => {
      navigation.push('ProductEditorAddLabel', {
         availableLanguages: supportedLanguages.filter((x) => !label[x]),
         mode: 'create',
         initialValue: {},
         onSubmit: (value) => {
            setValue('label', { ...label, [value.language]: { value: value.value, tags: value.tags } });
         },
      });
   };

   const handleChangeLabel = (language: string, data: ProductLabel) => {
      navigation.push('ProductEditorAddLabel', {
         availableLanguages: [language, ...supportedLanguages.filter((x) => !label[x])],
         mode: 'change',
         initialValue: { language, ...data },
         onDelete: () => {
            setValue('label', Object.fromEntries(Object.entries(label).filter(([lang]) => lang !== language)));
         },
         onSubmit: (value) => {
            setValue(
               'label',
               Object.fromEntries(
                  Object.entries(label).map((entry) =>
                     entry[0] === language ? [value.language, { value: value.value, tags: value.tags }] : entry,
                  ),
               ),
            );
         },
      });
   };

   return {
      renderHeader: () => <SettingsHeader label={t('create_product.product_name')} />,
      settings: [
         ...Object.entries(label ?? {}).map<SettingsItem>(([language, value]) => ({
            key: language,
            render: (props) => {
               const hasTags = Boolean(value.tags && value.tags.length > 0);
               return (
                  <SettingsButtonLink
                     title={value.value}
                     secondary={t(`languages.${language}`) + (hasTags ? ' | ' + value.tags?.join(', ') : '')}
                     showSecondaryBelow={hasTags}
                     onPress={() => handleChangeLabel(language, value)}
                     {...props}
                  />
               );
            },
         })),
         {
            key: 'add-button',
            render: (props) => (
               <SettingsButtonLink
                  title={t('create_product.add_label')}
                  onPress={handleAddLabel}
                  {...props}
                  textStyles={{ color: theme.colors.primary }}
                  icon="arrow"
               />
            ),
         },
      ],
   };
}

import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { UseFormReturn, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Caption, useTheme } from 'react-native-paper';
import { ActionButtonLink, ActionHeader, ActionListItem, ActionListSection } from 'src/components/ActionList';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ProductLabel, ProductProperties } from 'src/types';

const supportedLanguages = ['de', 'en'];

export default function ProductLabelSection({ setValue, watch, control }: UseFormReturn<ProductProperties>) {
   const theme = useTheme();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
   const label = watch('label');
   const { t } = useTranslation();

   const { errors } = useFormState({ control });

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

   return (
      <ActionListSection name="label" renderHeader={() => <ActionHeader label={t('create_product.product_name')} />}>
         {Object.entries(label ?? {}).map(([language, value]) => (
            <ActionListItem
               name={language}
               render={() => {
                  const hasTags = Boolean(value.tags && value.tags.length > 0);
                  return (
                     <ActionButtonLink
                        title={value.value}
                        secondary={t(`languages.${language}`) + (hasTags ? ' | ' + value.tags?.join(', ') : '')}
                        showSecondaryBelow={hasTags}
                        onPress={() => handleChangeLabel(language, value)}
                     />
                  );
               }}
            />
         ))}
         <ActionListItem
            name="add-button"
            render={() => (
               <>
                  <ActionButtonLink
                     title={t('create_product.add_label')}
                     onPress={handleAddLabel}
                     textStyles={{ color: theme.colors.primary }}
                     icon="arrow"
                  />
                  {errors.label && (
                     <Caption style={{ color: theme.colors.error, margin: 24 }}>{errors.label.message}</Caption>
                  )}
               </>
            )}
         />
      </ActionListSection>
   );
}

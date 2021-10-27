import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, StyleSheet } from 'react-native';
import { Caption, useTheme } from 'react-native-paper';
import SettingsButtonLink from 'src/components/Settings/Items/SettingsButtonLink';
import SettingsTextInput from 'src/components/Settings/Items/SettingsTextInput';
import SettingsList, { SettingsSection } from 'src/components/Settings/SettingsList';
import useActionSheetWrapper, { CancelButton, SheetButton } from 'src/hooks/useActionSheetWrapper';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ProductLabelViewModel } from '../types';

const tagsToString = (tags?: string[] | null) => tags?.join(', ') ?? '';
const stringToTags = (s?: string) =>
   s
      ? s
           .split(',')
           .map((x) => x.trim())
           .filter((x) => !!x)
      : undefined;

type Props = {
   route: RouteProp<RootNavigatorParamList, 'ProductEditorAddLabel'>;
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
};

export default function AddLabelScreen({
   route: {
      params: { initialValue, availableLanguages, onSubmit, mode, onDelete },
   },
   navigation,
}: Props) {
   const { t } = useTranslation();
   const theme = useTheme();

   const {
      control,
      formState: { isValid },
      handleSubmit,
   } = useForm<Omit<ProductLabelViewModel, 'tags'> & { tags: string }>({
      defaultValues: { language: availableLanguages[0], ...initialValue, tags: tagsToString(initialValue.tags) },
      mode: 'all',
   });

   const showActionSheet = useActionSheetWrapper();

   const handleSelectLanguage = (onChange: (newValue: string) => void) => {
      showActionSheet([
         ...availableLanguages.map<SheetButton>((x) => ({ label: t(`languages.${x}`), onPress: () => onChange(x) })),
         CancelButton(),
      ]);
   };

   const handleDelete = () => {
      onDelete?.();
      navigation.goBack();
   };

   useLayoutEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <Button
               disabled={!isValid}
               title={mode === 'create' ? t('common:add') : t('common:save')}
               onPress={handleSubmit((values) => {
                  onSubmit({ ...values, tags: stringToTags(values.tags) });
                  navigation.goBack();
               })}
            />
         ),
         headerTitle: t(mode === 'create' ? 'create_product.add_label' : 'create_product.change_label'),
      });
   }, [isValid]);

   return (
      <SettingsList
         settings={[
            {
               settings: [
                  {
                     key: 'language',
                     render: () => (
                        <Controller
                           control={control}
                           name="language"
                           rules={{ required: true }}
                           render={({ field: { value, onChange } }) => (
                              <SettingsButtonLink
                                 title={t('common:language')}
                                 onPress={() => handleSelectLanguage(onChange)}
                                 secondary={t(`languages.${value}`)}
                              />
                           )}
                        />
                     ),
                  },
               ],
            },
            {
               settings: [
                  {
                     key: 'label',
                     render: () => (
                        <Controller
                           control={control}
                           name="value"
                           rules={{ required: true }}
                           render={({ field: { value, onChange } }) => (
                              <SettingsTextInput
                                 titleStyle={styles.textInputTitle}
                                 title={t('product_properties.label')}
                                 value={value}
                                 onChangeValue={onChange}
                                 placeholder={t('create_product.label_placeholder')}
                                 autoFocus
                              />
                           )}
                        />
                     ),
                  },
                  {
                     key: 'tags',
                     render: () => (
                        <>
                           <Controller
                              control={control}
                              name="tags"
                              render={({ field: { value, onChange } }) => (
                                 <SettingsTextInput
                                    titleStyle={styles.textInputTitle}
                                    title={t('product_properties.tags')}
                                    value={value}
                                    placeholder={t('create_product.tags_placeholder')}
                                    onChangeValue={onChange}
                                 />
                              )}
                           />
                           <Caption style={styles.description}>{t('create_product.label_description')}</Caption>
                        </>
                     ),
                  },
               ],
            },
            ...[
               onDelete
                  ? ({
                       settings: [
                          {
                             key: 'remove',
                             render: () => (
                                <SettingsButtonLink
                                   textStyles={{ color: theme.colors.primary }}
                                   title={t('common:remove')}
                                   onPress={handleDelete}
                                />
                             ),
                          },
                       ],
                    } as SettingsSection)
                  : undefined,
            ].filter((x): x is SettingsSection => x !== undefined),
         ]}
      />
   );
}

const styles = StyleSheet.create({
   textInputTitle: {
      flex: 0.5,
   },
   description: {
      marginTop: 16,
      marginHorizontal: 24,
   },
});

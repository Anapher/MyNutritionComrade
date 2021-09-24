import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TFunction } from 'i18next';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, SectionListData } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import SettingsHeader from 'src/components/Settings/SettingsHeader';
import SettingsList, { SettingsItem, SettingsSection } from 'src/components/Settings/SettingsList';
import SettingsNumberInput from 'src/components/Settings/SettingsNumberInput';
import { TagLiquid } from 'src/consts';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { getServings, ServingInfo } from '../data';

const servingsFactory: (isLiquid: boolean, t: TFunction) => { title: string; data: ServingInfo[] }[] = (
   isLiquid,
   t,
) => {
   const servings = getServings(isLiquid);

   return [
      {
         title: t('create_product.serving_categories.product'),
         data: [servings.package, servings.portion],
      },
      {
         title: t('create_product.serving_categories.kitchen_measurements'),
         data: [servings.cup, servings.te, servings.ts],
      },
      {
         title: t('create_product.serving_categories.applications'),
         data: [servings.slice, servings.piece, servings.bread],
      },
      {
         title: t('create_product.serving_categories.quantities'),
         data: [servings.small, servings.medium, servings.large, servings.extraLarge],
      },
   ];
};

type Props = {
   route: RouteProp<RootNavigatorParamList, 'ProductEditorServings'>;
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
};

export default function ConfigureServingsScreen({
   route: {
      params: {
         form: { watch, control },
      },
   },
}: Props) {
   const theme = useTheme();

   const { t } = useTranslation();
   const defaultServing = watch('defaultServing');
   const tags = watch('tags');

   const isLiquid = Boolean(tags?.includes(TagLiquid));

   const showServingInfo = (labelKey: string, descriptionKey: string) => () => {
      Alert.alert(t(labelKey), t(descriptionKey));
   };

   return (
      <SettingsList
         settings={[
            ...servingsFactory(isLiquid, t).map<SettingsSection>(({ title, data }) => ({
               renderHeader: () => <SettingsHeader label={title} />,
               settings: data
                  .filter((x) => x.predefinedValue !== 0)
                  .map<SettingsItem>(({ id, labelKey, descriptionKey, predefinedValue }) => ({
                     key: id,
                     render: (props) => (
                        <Controller
                           control={control}
                           name={`servings.${id}`}
                           render={({ field: { value, onChange } }) =>
                              predefinedValue === undefined ? (
                                 <SettingsNumberInput
                                    title={t(labelKey)}
                                    onChangeValue={onChange as any}
                                    value={value}
                                    placeholder="None"
                                    rightAction={
                                       <IconButton
                                          icon="information-outline"
                                          color={theme.colors.disabled}
                                          onPress={showServingInfo(labelKey, descriptionKey)}
                                       />
                                    }
                                    {...props}
                                 />
                              ) : (
                                 <SettingsNumberInput
                                    title={t(labelKey)}
                                    onChangeValue={() => {}}
                                    value={predefinedValue}
                                    inputProps={{ editable: false, style: { color: theme.colors.disabled } }}
                                    titleStyle={{ color: theme.colors.disabled }}
                                    {...props}
                                 />
                              )
                           }
                        />
                     ),
                  })),
            })),
         ]}
      />
   );
}

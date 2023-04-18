import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TFunction } from 'i18next';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { ActionList, ActionListItem, ActionListSection, ActionNumberInput } from 'src/components/ActionList';
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
   const tags = watch('tags');

   const isLiquid = Boolean(tags?.liquid);

   const showServingInfo = (labelKey: string, descriptionKey: string) => () => {
      Alert.alert(t(labelKey), t(descriptionKey));
   };

   return (
      <ActionList>
         {servingsFactory(isLiquid, t).map(({ title, data }) => (
            <ActionListSection name={title} key={title}>
               {data
                  .filter((x) => x.predefinedValue !== 0)
                  .map(({ id, labelKey, descriptionKey, predefinedValue }) => (
                     <ActionListItem
                        key={id}
                        name={id}
                        render={() => (
                           <Controller
                              control={control}
                              name={`servings.${id}`}
                              render={({ field: { value, onChange } }) =>
                                 predefinedValue === undefined ? (
                                    <ActionNumberInput
                                       title={t(labelKey)}
                                       onChangeValue={onChange as any}
                                       value={value}
                                       placeholder="None"
                                       rightAction={
                                          <IconButton
                                             icon="information-outline"
                                             color={theme.colors.onSurfaceDisabled}
                                             onPress={showServingInfo(labelKey, descriptionKey)}
                                          />
                                       }
                                    />
                                 ) : (
                                    <ActionNumberInput
                                       title={t(labelKey)}
                                       onChangeValue={() => {}}
                                       value={predefinedValue}
                                       inputProps={{
                                          editable: false,
                                          style: { color: theme.colors.onSurfaceDisabled },
                                       }}
                                       titleStyle={{ color: theme.colors.onSurfaceDisabled }}
                                    />
                                 )
                              }
                           />
                        )}
                     />
                  ))}
            </ActionListSection>
         ))}
      </ActionList>
   );
}

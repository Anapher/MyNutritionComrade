import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native';
import { useTheme } from 'react-native-paper';
import {
   ActionHeader,
   ActionList,
   ActionListItem,
   ActionListSection,
   ActionTextInput,
} from 'src/components/ActionList';
import { nutritionalInfoSettingsItems } from 'src/features/product-create/components/ProductEditor/ProductNutritionalValuesSection';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { FoodPortionCustom } from 'src/types';
import { schema } from '../validation';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   route: RouteProp<RootNavigatorParamList, 'AddCustomProduct'>;
};

export default function AddCustomProductScreen({
   route: {
      params: { initialValues, onSubmit },
   },
   navigation,
}: Props) {
   const theme = useTheme();
   const { t } = useTranslation();
   const { control, handleSubmit } = useForm<FoodPortionCustom>({
      defaultValues: {
         ...initialValues,
         type: 'custom',
         nutritionalInfo: { ...initialValues?.nutritionalInfo, volume: 100 },
      },
      resolver: zodResolver(schema),
   });

   const handleCreate = (value: FoodPortionCustom) => {
      onSubmit(value);
   };

   useLayoutEffect(() => {
      navigation.setOptions({
         headerRight: () => <Button title={t('common:create')} onPress={handleSubmit(handleCreate)} />,
      });
   }, [handleSubmit]);

   return (
      <ActionList>
         <ActionListSection name="label">
            <ActionListItem
               name="label"
               render={() => (
                  <Controller
                     control={control}
                     name="label"
                     render={({ field: { value, onChange } }) => (
                        <ActionTextInput
                           title={t('product_properties.label')}
                           placeholder={t('common:optional')}
                           value={value}
                           onChangeValue={onChange}
                        />
                     )}
                  />
               )}
            />
         </ActionListSection>
         <ActionListSection
            name="nutritional_info"
            renderHeader={() => <ActionHeader label={t('product_properties.nutritional_values')} />}
         >
            {nutritionalInfoSettingsItems(control as any, theme, t, 'nutritionalInfo.')}
         </ActionListSection>
      </ActionList>
   );
}

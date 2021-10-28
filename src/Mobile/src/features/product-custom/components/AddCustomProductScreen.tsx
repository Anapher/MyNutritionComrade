import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native';
import { useTheme } from 'react-native-paper';
import SettingsTextInput from 'src/components/Settings/Items/SettingsTextInput';
import SettingsHeader from 'src/components/Settings/SettingsHeader';
import SettingsList from 'src/components/Settings/SettingsList';
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
      <SettingsList
         settings={[
            {
               settings: [
                  {
                     key: 'label',
                     render: () => (
                        <Controller
                           control={control}
                           name="label"
                           render={({ field: { value, onChange } }) => (
                              <SettingsTextInput
                                 title="Label"
                                 placeholder="Optional"
                                 value={value}
                                 onChangeValue={onChange}
                              />
                           )}
                        />
                     ),
                  },
               ],
            },
            {
               renderHeader: () => <SettingsHeader label={t('product_properties.nutritional_values')} />,
               settings: nutritionalInfoSettingsItems(control as any, theme, t, 'nutritionalInfo.'),
            },
         ]}
      />
   );
}

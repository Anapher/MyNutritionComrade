import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import SettingsButtonLink from 'src/components/Settings/SettingsButtonLink';
import SettingsHeader from 'src/components/Settings/SettingsHeader';
import { SettingsSection } from 'src/components/Settings/SettingsList';
import SettingsTextInput from 'src/components/Settings/SettingsTextInput';
import { TagLiquid } from 'src/consts';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ProductProperties } from 'src/types';

export default function ProductCommonSection({ control, setValue }: UseFormReturn<ProductProperties>): SettingsSection {
   const theme = useTheme();
   const { showActionSheetWithOptions } = useActionSheet();
   const { t } = useTranslation();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

   const handleChangeBaseUnit = (onChange: (newValue?: string[]) => void) => {
      showActionSheetWithOptions(
         {
            options: ['g', 'ml'],
            userInterfaceStyle: 'dark',
         },
         (i) => {
            onChange(i === 0 ? undefined : [TagLiquid]);
         },
      );
   };

   const handleScanBarcode = () => {
      navigation.push('ScanBarcode', {
         onCodeScanned: (result) => setValue('code', result.data),
      });
   };

   return {
      renderHeader: () => <SettingsHeader label="Properties" />,
      settings: [
         {
            key: 'unit',
            render: (props) => (
               <Controller
                  name="tags"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                     <SettingsButtonLink
                        title={t('create_product.base_unit')}
                        onPress={() => handleChangeBaseUnit(onChange)}
                        secondary={value?.includes(TagLiquid) ? 'ml' : 'g'}
                        {...props}
                        icon="arrow"
                     />
                  )}
               />
            ),
         },
         {
            key: 'barcode',
            render: (props) => (
               <Controller
                  name="code"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                     <SettingsTextInput
                        title={t('create_product.barcode')}
                        value={value}
                        placeholder={t('create_product.enter_barcode')}
                        onChangeValue={onChange}
                        {...props}
                     />
                  )}
               />
            ),
         },
         {
            key: 'scan-barcode',
            render: (props) => (
               <SettingsButtonLink
                  title={t('create_product.scan_barcode')}
                  onPress={handleScanBarcode}
                  {...props}
                  icon="arrow"
               />
            ),
         },
      ],
   };
}

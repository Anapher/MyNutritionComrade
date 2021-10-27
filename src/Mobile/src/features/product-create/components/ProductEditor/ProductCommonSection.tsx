import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import SettingsButtonLink from 'src/components/Settings/Items/SettingsButtonLink';
import SettingsTextInput from 'src/components/Settings/Items/SettingsTextInput';
import SettingsHeader from 'src/components/Settings/SettingsHeader';
import { SettingsSection } from 'src/components/Settings/SettingsList';
import useActionSheetWrapper, { CancelButton } from 'src/hooks/useActionSheetWrapper';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ProductProperties, ProductTags } from 'src/types';

export default function ProductCommonSection({ control, setValue }: UseFormReturn<ProductProperties>): SettingsSection {
   const theme = useTheme();
   const showActionSheet = useActionSheetWrapper();
   const { t } = useTranslation();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

   const handleChangeBaseUnit = (onChange: (newValue?: ProductTags) => void) => {
      showActionSheet([
         { label: 'g', onPress: () => onChange(undefined) },
         { label: 'ml', onPress: () => onChange({ liquid: true }) },
         CancelButton(),
      ]);
   };

   const handleScanBarcode = () => {
      navigation.push('ScanBarcode', {
         onCodeScanned: (result) => setValue('code', result.data),
      });
   };

   return {
      renderHeader: () => <SettingsHeader label={t('properties')} />,
      settings: [
         {
            key: 'unit',
            render: () => (
               <Controller
                  name="tags"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                     <SettingsButtonLink
                        title={t('product_properties.base_unit')}
                        onPress={() => handleChangeBaseUnit(onChange)}
                        secondary={value?.liquid ? 'ml' : 'g'}
                        icon="arrow"
                     />
                  )}
               />
            ),
         },
         {
            key: 'barcode',
            render: () => (
               <Controller
                  name="code"
                  control={control}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                     <SettingsTextInput
                        title={t('product_properties.barcode')}
                        value={value}
                        placeholder={t('create_product.enter_barcode')}
                        onChangeValue={(val) => onChange(val || undefined)}
                        inputProps={{
                           autoCompleteType: 'off',
                           textContentType: 'none',
                           keyboardType: 'visible-password',
                           autoCorrect: false,
                        }}
                        error={error?.message}
                     />
                  )}
               />
            ),
         },
         {
            key: 'scan-barcode',
            render: () => (
               <SettingsButtonLink title={t('create_product.scan_barcode')} onPress={handleScanBarcode} icon="arrow" />
            ),
         },
      ],
   };
}

import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import {
   ActionButtonLink,
   ActionHeader,
   ActionListItem,
   ActionListSection,
   ActionTextInput,
} from 'src/components/ActionList';
import useActionSheetWrapper, { CancelButton } from 'src/hooks/useActionSheetWrapper';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ProductProperties, ProductTags } from 'src/types';

export default function ProductCommonSection({ control, setValue }: UseFormReturn<ProductProperties>) {
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

   return (
      <ActionListSection name="common" renderHeader={() => <ActionHeader label={t('properties')} />}>
         <ActionListItem
            name="unit"
            render={() => (
               <Controller
                  name="tags"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                     <ActionButtonLink
                        title={t('product_properties.base_unit')}
                        onPress={() => handleChangeBaseUnit(onChange)}
                        secondary={value?.liquid ? 'ml' : 'g'}
                        icon="arrow"
                     />
                  )}
               />
            )}
         />
         <ActionListItem
            name="barcode"
            render={() => (
               <Controller
                  name="code"
                  control={control}
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                     <ActionTextInput
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
            )}
         />
         <ActionListItem
            name="scan-barcode"
            render={() => (
               <ActionButtonLink title={t('create_product.scan_barcode')} onPress={handleScanBarcode} icon="arrow" />
            )}
         />
      </ActionListSection>
   );
}

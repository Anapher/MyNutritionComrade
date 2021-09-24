import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import SettingsHeader from 'src/components/Settings/SettingsHeader';
import { SettingsSection } from 'src/components/Settings/SettingsList';
import SettingsNumberInput from 'src/components/Settings/SettingsNumberInput';
import { TagLiquid } from 'src/consts';
import { ProductProperties } from 'src/types';
import { nutritionalInfo } from '../../data';

export default function ProductNutritionalValuesSection({
   control,
   watch,
}: UseFormReturn<ProductProperties>): SettingsSection {
   const theme = useTheme();
   const { t } = useTranslation();
   const tags = watch('tags');

   const baseUnit = tags?.includes(TagLiquid) ? 'ml' : 'g';

   return {
      renderHeader: () => (
         <SettingsHeader label={t('create_product.average_nutritional_values', { base: `100${baseUnit}` })} />
      ),
      settings: nutritionalInfo.map(({ name, translationKey, unit, inset }) => ({
         key: name,
         render: (props) => (
            <Controller
               control={control}
               name={`nutritionalInfo.${name}` as any}
               render={({ field: { value, onChange } }) => (
                  <SettingsNumberInput
                     title={t(`nutritional_info.${translationKey || name}`)}
                     placeholder={`0${unit}`}
                     value={value}
                     onChangeValue={onChange}
                     titleStyle={[styles.text, inset ? styles.textInset : undefined]}
                     inputProps={{
                        returnKeyType: 'next',
                        selectTextOnFocus: true,
                        blurOnSubmit: false,
                     }}
                     {...props}
                  />
               )}
            />
         ),
      })),
   };
}

const styles = StyleSheet.create({
   text: {
      flex: 2,
   },
   textInset: {
      marginLeft: 16,
      marginRight: -8,
   },
});

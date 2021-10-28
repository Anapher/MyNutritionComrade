import React from 'react';
import { Control, Controller, UseFormReturn, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Caption, useTheme } from 'react-native-paper';
import { TEXT_PADDING_LEFT } from 'src/components/Settings/config';
import SettingsHeader from 'src/components/Settings/SettingsHeader';
import { SettingsSection } from 'src/components/Settings/SettingsList';
import SettingsNumberInput from 'src/components/Settings/Items/SettingsNumberInput';
import { ProductProperties } from 'src/types';
import { getBaseUnit } from 'src/utils/product-utils';
import { nutritionalInfo } from '../../data';
import { TFunction } from 'i18next';

export default function ProductNutritionalValuesSection({
   control,
   watch,
}: UseFormReturn<ProductProperties>): SettingsSection {
   const theme = useTheme();
   const { t } = useTranslation();
   const tags = watch('tags');
   const { errors } = useFormState({ control });

   const baseUnit = getBaseUnit(tags);

   return {
      renderHeader: () => (
         <>
            <SettingsHeader label={t('create_product.average_nutritional_values', { base: `100${baseUnit}` })} />
            {errors.nutritionalInfo?.volume && (
               <Caption style={{ color: theme.colors.error, marginLeft: TEXT_PADDING_LEFT }}>
                  {errors.nutritionalInfo.volume.message}
               </Caption>
            )}
         </>
      ),
      settings: nutritionalInfoSettingsItems(control as any, theme, t, 'nutritionalInfo.'),
   };
}

export const nutritionalInfoSettingsItems = (
   control: Control,
   theme: ReactNativePaper.Theme,
   t: TFunction,
   path: string = '',
) => {
   return nutritionalInfo.map(({ name, translationKey, unit, inset }) => ({
      key: name,
      render: () => (
         <Controller
            control={control}
            name={`${path}${name}` as any}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
               <SettingsNumberInput
                  title={t(`nutritional_info.${translationKey || name}`)}
                  placeholder={`0${unit}`}
                  value={value}
                  onChangeValue={onChange}
                  titleStyle={[
                     styles.text,
                     inset ? styles.textInset : undefined,
                     error ? { color: theme.colors.error } : undefined,
                  ]}
                  inputProps={{
                     returnKeyType: 'next',
                     selectTextOnFocus: true,
                     blurOnSubmit: false,
                  }}
               />
            )}
         />
      ),
   }));
};

const styles = StyleSheet.create({
   text: {
      flex: 2,
   },
   textInset: {
      marginLeft: 16,
      marginRight: -8,
   },
});

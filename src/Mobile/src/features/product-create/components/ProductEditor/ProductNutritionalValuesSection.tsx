import { TFunction } from 'i18next';
import React from 'react';
import { Control, Controller, UseFormReturn, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Caption, useTheme } from 'react-native-paper';
import { ActionHeader, ActionListItem, ActionListSection, ActionNumberInput } from 'src/components/ActionList';
import { config } from 'src/components/ActionList';
import { ProductProperties } from 'src/types';
import { getBaseUnit } from 'src/utils/product-utils';
import { nutritionalInfo } from '../../data';

export default function ProductNutritionalValuesSection({ control, watch }: UseFormReturn<ProductProperties>) {
   const theme = useTheme();
   const { t } = useTranslation();
   const tags = watch('tags');
   const { errors } = useFormState({ control });

   const baseUnit = getBaseUnit(tags);

   return (
      <ActionListSection
         name="nutritional_info"
         renderHeader={() => (
            <>
               <ActionHeader label={t('create_product.average_nutritional_values', { base: `100${baseUnit}` })} />
               {errors.nutritionalInfo?.volume && (
                  <Caption style={{ color: theme.colors.error, marginLeft: config.TEXT_PADDING_LEFT }}>
                     {errors.nutritionalInfo.volume.message}
                  </Caption>
               )}
            </>
         )}
      >
         {nutritionalInfoSettingsItems(control as any, theme, t, 'nutritionalInfo.')}
      </ActionListSection>
   );
}

export const nutritionalInfoSettingsItems = (
   control: Control,
   theme: ReactNativePaper.Theme,
   t: TFunction,
   path: string = '',
) => {
   return nutritionalInfo.map(({ name, translationKey, unit, inset }) => (
      <ActionListItem
         name={name}
         render={() => (
            <Controller
               control={control}
               name={`${path}${name}` as any}
               render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <ActionNumberInput
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
         )}
      />
   ));
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

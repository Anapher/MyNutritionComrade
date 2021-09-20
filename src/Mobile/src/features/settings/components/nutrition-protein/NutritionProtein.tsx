import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsButtonContainerProps } from 'src/components/Settings/SettingsButtonContainer';
import SettingsButtonLink from 'src/components/Settings/SettingsButtonLink';
import SettingsList, { SettingsItem } from 'src/components/Settings/SettingsList';
import SettingsNumberInput from 'src/components/Settings/SettingsNumberInput';
import { setNutritionGoal } from '../../reducer';
import { selectNutritionGoal } from '../../selectors';
import { ProteinByBodyweightNutritionGoal, ProteinFixedNutritionGoal, UserNutritionGoal } from '../../types';

const presetProteinPerKg = [
   { key: 'build_maintain_muscle', amount: 1.8 },
   { key: 'loose_weight_without_muscles', amount: 2.6 },
];

function proteinFixedItems(
   { protein }: UserNutritionGoal,
   t: TFunction,
   handleChange: (newValue: Partial<UserNutritionGoal>) => void,
): (SettingsItem | undefined)[] {
   const selected = protein?.type === 'proteinFixed';

   return [
      {
         key: 'proteinFixed',
         render: (props) => (
            <SettingsButtonLink
               title={t('settings.protein.manual_protein_per_day')}
               selectable
               selected={selected}
               onPress={() => handleChange({ protein: { type: 'proteinFixed', proteinPerDay: 120 } })}
               {...props}
            />
         ),
      },
      selected
         ? {
              key: 'proteinFixed.input',
              render: (props: SettingsButtonContainerProps) => (
                 <SettingsNumberInput
                    style={{ marginBottom: 16 }}
                    title={t('settings.protein.protein_per_day') + ':'}
                    value={protein.proteinPerDay || undefined}
                    onChangeValue={(x) => handleChange({ protein: { type: 'proteinFixed', proteinPerDay: x ?? 0 } })}
                    {...props}
                    bottom
                 />
              ),
           }
         : undefined,
   ];
}

function manualProteinPerKg(
   { protein }: UserNutritionGoal,
   t: TFunction,
   handleChange: (newValue: Partial<UserNutritionGoal>) => void,
): (SettingsItem | undefined)[] {
   const selected =
      protein?.type === 'proteinByBodyweight' &&
      !presetProteinPerKg.find((x) => x.amount === protein.proteinPerKgBodyweight);

   return [
      {
         key: 'protein_per_kg',
         render: (props) => (
            <SettingsButtonLink
               title={t('settings.protein.manual_protein_per_kg')}
               selectable
               style={{ marginTop: selected ? 16 : 0 }}
               {...props}
               selected={selected}
               onPress={() => handleChange({ protein: { type: 'proteinByBodyweight', proteinPerKgBodyweight: 2 } })}
            />
         ),
      },
      selected
         ? {
              key: 'protein_per_kg.manual',
              render: (props) => (
                 <SettingsNumberInput
                    title={t('settings.protein.protein_per_day_kg') + ':'}
                    value={protein.proteinPerKgBodyweight || undefined}
                    onChangeValue={(x) =>
                       handleChange({ protein: { type: 'proteinByBodyweight', proteinPerKgBodyweight: x ?? 0 } })
                    }
                    style={{ marginBottom: 16 }}
                    {...props}
                 />
              ),
           }
         : undefined,
   ];
}

export default function NutritionProtein() {
   const { t } = useTranslation();
   const dispatch = useDispatch();

   const nutritionGoal = useSelector(selectNutritionGoal);
   const protein = nutritionGoal.protein;

   const handleChange = (values: Partial<UserNutritionGoal>) => {
      dispatch(setNutritionGoal({ ...nutritionGoal, ...values }));
   };

   const settings: (SettingsItem | undefined)[] = [
      ...proteinFixedItems(nutritionGoal, t, handleChange),
      ...manualProteinPerKg(nutritionGoal, t, handleChange),
      ...presetProteinPerKg.map<SettingsItem>(({ key, amount }) => ({
         key,
         render: (props) => (
            <SettingsButtonLink
               title={t(`settings.protein.${key}`)}
               secondary={t(`settings.protein.${key}_description`)}
               showSecondaryBelow
               selectable
               selected={protein?.type === 'proteinByBodyweight' && protein.proteinPerKgBodyweight === amount}
               onPress={() =>
                  handleChange({ protein: { type: 'proteinByBodyweight', proteinPerKgBodyweight: amount } })
               }
               {...props}
            />
         ),
      })),
      {
         key: 'none',
         render: (props) => (
            <SettingsButtonLink
               title={t('settings.protein.none')}
               selectable
               selected={!protein}
               {...props}
               onPress={() => handleChange({ protein: undefined })}
            />
         ),
      },
   ];

   return <SettingsList settings={settings.filter((x): x is SettingsItem => !!x)}></SettingsList>;
}

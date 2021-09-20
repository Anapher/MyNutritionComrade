import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Caption, Paragraph } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import SettingsButtonLink from 'src/components/Settings/SettingsButtonLink';
import SettingsList, { SettingsItem, SettingsSection } from 'src/components/Settings/SettingsList';
import SettingsNumberInput from 'src/components/Settings/SettingsNumberInput';
import { setNutritionGoal } from '../../reducer';
import { selectNutritionGoal } from '../../selectors';
import { UserNutritionGoal } from '../../types';
import getSections from './CaloriesCalculationOptions';

export default function NutritionCalories() {
   const { t } = useTranslation();
   const dispatch = useDispatch();

   const nutritionGoal = useSelector(selectNutritionGoal);
   const calories = nutritionGoal.calories;

   const handleChange = (values: Partial<UserNutritionGoal>) => {
      dispatch(setNutritionGoal({ ...nutritionGoal, ...values }));
   };

   return (
      <SettingsList
         settings={[
            {
               settings: [
                  {
                     key: 'manual',
                     render: (props) => (
                        <SettingsButtonLink
                           title={t('settings.calories.manual_value')}
                           selectable
                           selected={calories?.type === 'caloriesFixed'}
                           onPress={() => handleChange({ calories: { type: 'caloriesFixed', caloriesPerDay: 2000 } })}
                           {...props}
                        />
                     ),
                  },
                  {
                     key: 'calculate',
                     render: (props) => (
                        <SettingsButtonLink
                           title={t('settings.calories.calculate_value')}
                           selectable
                           selected={calories?.type === 'caloriesMifflinStJeor'}
                           onPress={() =>
                              handleChange({
                                 calories: {
                                    type: 'caloriesMifflinStJeor',
                                    calorieBalance: 0,
                                    calorieOffset: 0,
                                    palFactor: 1.55,
                                 },
                              })
                           }
                           {...props}
                        />
                     ),
                  },
                  {
                     key: 'none',
                     render: (props) => (
                        <SettingsButtonLink
                           title={t('settings.calories.none')}
                           selectable
                           selected={!calories}
                           onPress={() =>
                              handleChange({
                                 calories: undefined,
                              })
                           }
                           {...props}
                        />
                     ),
                  },
               ],
            },
            ...getOptionsSection(nutritionGoal, t, handleChange),
         ]}
      />
   );
}

function getOptionsSection(
   { calories }: UserNutritionGoal,
   t: TFunction,
   handleChange: (value: Partial<UserNutritionGoal>) => void,
): SettingsSection[] {
   if (!calories) return [];

   switch (calories.type) {
      case 'caloriesFixed':
         return [
            {
               settings: [
                  {
                     key: 'caloriesValue',
                     render: (props) => (
                        <SettingsNumberInput
                           value={calories.caloriesPerDay}
                           title={t('settings.calories.calorie_intake_day')}
                           onChangeValue={(value) =>
                              handleChange({ calories: { type: 'caloriesFixed', caloriesPerDay: value ?? 0 } })
                           }
                           {...props}
                        />
                     ),
                  },
               ],
            },
         ];
      case 'caloriesMifflinStJeor':
         return getSections(calories, t, (value) => handleChange({ calories: { ...calories, ...value } }));
   }
}

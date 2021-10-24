import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import SettingsButtonLink from 'src/components/Settings/Items/SettingsButtonLink';
import SettingsNumberInput from 'src/components/Settings/Items/SettingsNumberInput';
import SettingsList, { SettingsSection } from 'src/components/Settings/SettingsList';
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
                     render: () => (
                        <SettingsButtonLink
                           title={t('settings.calories.manual_value')}
                           selectable
                           selected={calories?.type === 'caloriesFixed'}
                           onPress={() => handleChange({ calories: { type: 'caloriesFixed', caloriesPerDay: 2000 } })}
                        />
                     ),
                  },
                  {
                     key: 'calculate',
                     render: () => (
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
                        />
                     ),
                  },
                  {
                     key: 'none',
                     render: () => (
                        <SettingsButtonLink
                           title={t('settings.calories.none')}
                           selectable
                           selected={!calories}
                           onPress={() =>
                              handleChange({
                                 calories: undefined,
                              })
                           }
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
                     render: () => (
                        <SettingsNumberInput
                           value={calories.caloriesPerDay}
                           title={t('settings.calories.calorie_intake_day')}
                           onChangeValue={(value) =>
                              handleChange({ calories: { type: 'caloriesFixed', caloriesPerDay: value ?? 0 } })
                           }
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

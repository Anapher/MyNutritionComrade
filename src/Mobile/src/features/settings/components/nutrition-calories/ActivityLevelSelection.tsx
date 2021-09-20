import { TFunction } from 'i18next';
import SettingsButtonLink from 'src/components/Settings/SettingsButtonLink';
import { SettingsItem } from 'src/components/Settings/SettingsList';
import { CaloriesMifflinStJeorNutritionGoal } from '../../types';
import React from 'react';

const referencePalFactors = [
   {
      key: 'sedentary',
      value: 1.2,
   },
   {
      key: 'lightly_active',
      value: 1.375,
   },
   {
      key: 'moderately_active',
      value: 1.55,
   },
   {
      key: 'very_active',
      value: 1.725,
   },
   {
      key: 'extra_active',
      value: 1.9,
   },
];

export default function getActivityLevelSelectionItems(
   caloriesGoal: CaloriesMifflinStJeorNutritionGoal,
   t: TFunction,
   handleChange: (value: Partial<CaloriesMifflinStJeorNutritionGoal>) => void,
): SettingsItem[] {
   return referencePalFactors.map<SettingsItem>(({ key, value }) => ({
      key,
      render: (props) => (
         <SettingsButtonLink
            title={t(`settings.calories.activity_level.${key}.description`)}
            secondary={value.toString()}
            selectable
            selected={caloriesGoal.palFactor === value}
            onPress={() => handleChange({ palFactor: value })}
            {...props}
         />
      ),
   }));
}

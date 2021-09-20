import { TFunction } from 'i18next';
import React from 'react';
import { View } from 'react-native';
import { Caption, Paragraph, Text } from 'react-native-paper';
import { SettingsSection } from 'src/components/Settings/SettingsList';
import SettingsNumberInput from 'src/components/Settings/SettingsNumberInput';
import { CaloriesMifflinStJeorNutritionGoal, UserNutritionGoal } from '../../types';
import getActivityLevelSelectionItems from './ActivityLevelSelection';
import CaloriesCalculationResult from './CaloriesCalculationResult';

export default function getSections(
   goal: CaloriesMifflinStJeorNutritionGoal,
   t: TFunction,
   handleChange: (value: Partial<CaloriesMifflinStJeorNutritionGoal>) => void,
): SettingsSection[] {
   return [
      {
         renderHeader: () => (
            <View style={{ marginBottom: 8 }}>
               <Caption style={{ textAlign: 'center' }}>{t('settings.calories.calculated_caption')}</Caption>
               <Paragraph style={[{ marginHorizontal: 16 }]}>{t('settings.calories.calculated_description')}</Paragraph>
            </View>
         ),
         settings: getActivityLevelSelectionItems(goal, t, handleChange),
      },
      {
         settings: [
            {
               key: 'balance',
               render: (props) => (
                  <SettingsNumberInput
                     title="Balance"
                     value={goal.calorieBalance}
                     onChangeValue={(value) => handleChange({ calorieBalance: value })}
                     {...props}
                  />
               ),
            },
         ],
      },
      {
         settings: [
            {
               key: 'result',
               render: () => <CaloriesCalculationResult goal={goal} />,
            },
         ],
      },
   ];
}

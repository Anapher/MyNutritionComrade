import Slider from '@react-native-community/slider';
import { TFunction } from 'i18next';
import React from 'react';
import { View } from 'react-native';
import { Caption, Paragraph, Text } from 'react-native-paper';
import SettingsButtonContainer from 'src/components/Settings/SettingsButtonContainer';
import SettingsHeader from 'src/components/Settings/SettingsHeader';
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
         renderHeader: () => <SettingsHeader label={t('settings.calories.balance')} />,
         settings: [
            {
               key: 'balance',
               render: (props) => (
                  <SettingsButtonContainer padding {...props}>
                     <Slider
                        minimumValue={-1000}
                        maximumValue={1000}
                        step={50}
                        value={goal.calorieBalance}
                        onValueChange={(value) => handleChange({ calorieBalance: value })}
                     />
                  </SettingsButtonContainer>
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

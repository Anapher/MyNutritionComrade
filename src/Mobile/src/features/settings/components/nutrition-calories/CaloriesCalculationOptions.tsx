import Slider from '@react-native-community/slider';
import { TFunction } from 'i18next';
import React from 'react';
import { View } from 'react-native';
import { Caption, Paragraph } from 'react-native-paper';
import { ActionButtonLink, ActionHeader, ActionListItem, ActionListSection } from 'src/components/ActionList';
import ActionItem from 'src/components/ActionList/Items/ActionItem';
import { CaloriesMifflinStJeorNutritionGoal } from '../../types';
import { referencePalFactors } from './ActivityLevelSelection';
import CaloriesCalculationResult from './CaloriesCalculationResult';

export default function getSections(
   goal: CaloriesMifflinStJeorNutritionGoal,
   t: TFunction,
   handleChange: (value: Partial<CaloriesMifflinStJeorNutritionGoal>) => void,
) {
   return [
      <ActionListSection
         name="calculation"
         renderHeader={() => (
            <View style={{ marginBottom: 8 }}>
               <Caption style={{ textAlign: 'center' }}>{t('settings.calories.calculated_caption')}</Caption>
               <Paragraph style={[{ marginHorizontal: 16 }]}>{t('settings.calories.calculated_description')}</Paragraph>
            </View>
         )}
      >
         {referencePalFactors.map(({ key, value }) => (
            <ActionListItem
               key={key}
               name={key}
               render={() => (
                  <ActionButtonLink
                     title={t(`settings.calories.activity_level.${key}.description`)}
                     secondary={value.toString()}
                     selectable
                     selected={goal.palFactor === value}
                     onPress={() => handleChange({ palFactor: value })}
                  />
               )}
            />
         ))}
      </ActionListSection>,
      <ActionListSection name="balance" renderHeader={() => <ActionHeader label={t('settings.calories.balance')} />}>
         <ActionListItem
            name="balance"
            render={() => (
               <ActionItem padding>
                  <Slider
                     minimumValue={-1000}
                     maximumValue={1000}
                     step={50}
                     value={goal.calorieBalance}
                     onValueChange={(value) => handleChange({ calorieBalance: value })}
                  />
               </ActionItem>
            )}
         />
      </ActionListSection>,
      <ActionListSection name="result">
         <ActionListItem name="result" render={() => <CaloriesCalculationResult goal={goal} />} />
      </ActionListSection>,
   ];
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
   ActionButtonLink,
   ActionList,
   ActionListItem,
   ActionListSection,
   ActionNumberInput,
} from 'src/components/ActionList';
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
      <ActionList>
         <ActionListSection name="default">
            <ActionListItem
               name="manual"
               render={() => (
                  <ActionButtonLink
                     title={t('settings.calories.manual_value')}
                     selectable
                     selected={calories?.type === 'caloriesFixed'}
                     onPress={() => handleChange({ calories: { type: 'caloriesFixed', caloriesPerDay: 2000 } })}
                  />
               )}
            />
            <ActionListItem
               name="calculate"
               render={() => (
                  <ActionButtonLink
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
               )}
            />
            <ActionListItem
               name="none"
               render={() => (
                  <ActionButtonLink
                     title={t('settings.calories.none')}
                     selectable
                     selected={!calories}
                     onPress={() =>
                        handleChange({
                           calories: undefined,
                        })
                     }
                  />
               )}
            />
         </ActionListSection>
         {calories?.type === 'caloriesFixed' && (
            <ActionListSection name="caloriesFixed">
               <ActionListItem
                  name="caloriesValue"
                  render={() => (
                     <ActionNumberInput
                        value={calories.caloriesPerDay}
                        title={t('settings.calories.calorie_intake_day')}
                        onChangeValue={(value) =>
                           handleChange({ calories: { type: 'caloriesFixed', caloriesPerDay: value ?? 0 } })
                        }
                     />
                  )}
               />
            </ActionListSection>
         )}
         {calories?.type === 'caloriesMifflinStJeor' &&
            getSections(calories, t, (value) => handleChange({ calories: { ...calories, ...value } }))}
      </ActionList>
   );
}

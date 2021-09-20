import React from 'react';
import { View } from 'react-native';
import { Caption, Subheading } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { calculateBmr } from 'src/utils/mifflin-st-jeor';
import { selectPersonalInfo, selectWeightInfo } from '../../selectors';
import { CaloriesMifflinStJeorNutritionGoal } from '../../types';
import { calculateAge } from '../personal-info/utils';

type Props = {
   goal: CaloriesMifflinStJeorNutritionGoal;
};
export default function CaloriesCalculationResult({ goal }: Props) {
   const personalInfo = useSelector(selectPersonalInfo);
   const weight = useSelector(selectWeightInfo);

   if (!personalInfo.gender || !personalInfo.birthday || !personalInfo.height || !weight.currentWeight) {
      return null;
   }

   const bms = calculateBmr(
      personalInfo.gender,
      weight.currentWeight,
      personalInfo.height * 100,
      calculateAge(personalInfo.birthday),
   );

   const result = bms * goal.palFactor + (goal.calorieBalance ?? 0);

   return (
      <View>
         <Caption style={{ textAlign: 'center' }}>{`${bms} kcal * ${goal.palFactor} + ${
            goal.calorieBalance ?? 0
         } kcal`}</Caption>
         <Subheading style={{ textAlign: 'center' }}>{result.toFixed(0)} kcal</Subheading>
      </View>
   );
}

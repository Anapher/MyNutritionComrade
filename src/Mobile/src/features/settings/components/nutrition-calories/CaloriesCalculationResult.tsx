import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, StyleSheet, View } from 'react-native';
import { Caption, Subheading, Text, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { calculateBmr } from 'src/utils/mifflin-st-jeor';
import { selectPersonalInfo, selectWeightInfo } from '../../selectors';
import { CaloriesMifflinStJeorNutritionGoal } from '../../types';
import { calculateAge } from '../personal-info/utils';

type Props = {
   goal: CaloriesMifflinStJeorNutritionGoal;
};
export default function CaloriesCalculationResult({ goal }: Props) {
   const { t } = useTranslation();
   const theme = useTheme();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

   const personalInfo = useSelector(selectPersonalInfo);
   const weight = useSelector(selectWeightInfo);

   if (!personalInfo.gender || !personalInfo.birthday || !personalInfo.height || !weight.currentWeight) {
      const personalInfoMissing = !personalInfo.gender || !personalInfo.birthday || !personalInfo.height;
      const weightMissing = !weight.currentWeight;

      return (
         <View style={styles.container}>
            <Text style={{ color: theme.colors.error }}>{t('settings.calories.calulcation_data_missing')}</Text>
            <View style={styles.buttonContainer}>
               {personalInfoMissing && (
                  <Button
                     title={t('settings.calories.add_personal_info')}
                     onPress={() => navigation.push('SettingsPersonalInfo')}
                  />
               )}
               {weightMissing && (
                  <Button
                     title={t('settings.calories.add_body_weight')}
                     onPress={() => navigation.push('SettingsWeight')}
                  />
               )}
            </View>
         </View>
      );
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
         <Caption style={styles.centerText}>{`${bms} kcal * ${goal.palFactor} ${
            goal.calorieBalance < 0 ? '-' : '+'
         } ${Math.abs(goal.calorieBalance ?? 0)} kcal`}</Caption>
         <Subheading style={styles.centerText}>{result.toFixed(0)} kcal</Subheading>
      </View>
   );
}

const styles = StyleSheet.create({
   centerText: {
      textAlign: 'center',
   },
   container: {
      margin: 16,
   },
   buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 8,
   },
});

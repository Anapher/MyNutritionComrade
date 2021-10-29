import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ActionButtonLink } from 'src/components/ActionList';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { selectNutritionGoal } from '../../selectors';

export default function SettingsItem() {
   const { t } = useTranslation();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
   const nutritionGoal = useSelector(selectNutritionGoal);

   let summary: string;
   if (nutritionGoal.protein?.type === 'proteinFixed') {
      summary = t('settings.protein.summary_fixed', { value: nutritionGoal.protein.proteinPerDay });
   } else if (nutritionGoal.protein?.type === 'proteinByBodyweight') {
      summary = t('settings.protein.summary_per_kg', { value: nutritionGoal.protein.proteinPerKgBodyweight });
   } else {
      summary = t('settings.not_set');
   }

   return (
      <ActionButtonLink
         title={t('settings.protein.title')}
         onPress={() => navigation.push('SettingsNutritionGoalProtein')}
         icon="arrow"
         secondary={summary}
      />
   );
}

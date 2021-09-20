import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { SettingsButtonContainerProps } from 'src/components/Settings/SettingsButtonContainer';
import SettingsButtonLink from 'src/components/Settings/SettingsButtonLink';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { selectNutritionGoal } from '../../selectors';

export default function SettingsItem(props: SettingsButtonContainerProps) {
   const { t } = useTranslation();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
   const nutritionGoal = useSelector(selectNutritionGoal);

   return (
      <SettingsButtonLink
         title={t('settings.calories.title')}
         onPress={() => navigation.push('SettingsNutritionGoalCalories')}
         icon="arrow"
         {...props}
      />
   );
}

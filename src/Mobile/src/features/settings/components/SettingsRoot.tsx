import React from 'react';
import { StyleSheet } from 'react-native';
import SettingsList from 'src/components/Settings/SettingsList';
import NutritionGoalCaloriesSettingsItem from './nutrition-calories/SettingsItem';
import NutritionGoalProteinSettingsItem from './nutrition-protein/SettingsItem';
import PersonalInfoSettingsItem from './personal-info/SettingsItem';
import WeightSettingsItem from './weight/SettingsItem';

export default function SettingsRoot() {
   return (
      <SettingsList
         style={styles.root}
         settings={[
            {
               settings: [
                  { key: 'personal', render: () => <PersonalInfoSettingsItem /> },
                  { key: 'weight', render: () => <WeightSettingsItem /> },
               ],
            },
            {
               settings: [
                  { key: 'calories', render: () => <NutritionGoalCaloriesSettingsItem /> },
                  { key: 'protein', render: () => <NutritionGoalProteinSettingsItem /> },
               ],
            },
         ]}
         contentInset={{ bottom: 16 }}
      />
   );
}

const styles = StyleSheet.create({
   root: {
      ...StyleSheet.absoluteFillObject,
      paddingVertical: 16,
   },
});

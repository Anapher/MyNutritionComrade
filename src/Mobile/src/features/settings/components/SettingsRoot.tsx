import React from 'react';
import { StyleSheet } from 'react-native';
import SettingsList from 'src/components/Settings/SettingsList';
import NutritionGoalCaloriesSettingsItem from './nutrition-calories/SettingsItem';
import NutritionGoalDistributionSettingsItem from './nutrition-distribution/SettingsItem';
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
                  { key: 'personal', render: (props) => <PersonalInfoSettingsItem {...props} /> },
                  { key: 'weight', render: (props) => <WeightSettingsItem {...props} /> },
               ],
            },
            {
               settings: [
                  { key: 'calories', render: (props) => <NutritionGoalCaloriesSettingsItem {...props} /> },
                  { key: 'protein', render: (props) => <NutritionGoalProteinSettingsItem {...props} /> },
                  { key: 'distribution', render: (props) => <NutritionGoalDistributionSettingsItem {...props} /> },
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

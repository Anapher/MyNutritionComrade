import React from 'react';
import { StyleSheet } from 'react-native';
import { ActionList, ActionListItem, ActionListSection } from 'src/components/ActionList';
import AccountSettingsItem from './account/AccountSettingsItem';
import IndexesSettingsItem from './indexes/IndexesSettingsItem';
import NutritionGoalCaloriesSettingsItem from './nutrition-calories/SettingsItem';
import NutritionGoalProteinSettingsItem from './nutrition-protein/SettingsItem';
import PersonalInfoSettingsItem from './personal-info/SettingsItem';
import WeightSettingsItem from './weight/SettingsItem';

export default function SettingsRoot() {
   return (
      <ActionList style={styles.root} contentInset={{ bottom: 16 }}>
         <ActionListSection name="personal">
            <ActionListItem name="personal" render={() => <PersonalInfoSettingsItem />} />
            <ActionListItem name="weight" render={() => <WeightSettingsItem />} />
         </ActionListSection>
         <ActionListSection name="goals">
            <ActionListItem name="calories" render={() => <NutritionGoalCaloriesSettingsItem />} />
            <ActionListItem name="protein" render={() => <NutritionGoalProteinSettingsItem />} />
         </ActionListSection>
         <ActionListSection name="account">
            <ActionListItem name="account" render={() => <AccountSettingsItem />} />
         </ActionListSection>
         <ActionListSection name="indexes">
            <ActionListItem name="indexes" render={() => <IndexesSettingsItem />} />
         </ActionListSection>
      </ActionList>
   );
}

const styles = StyleSheet.create({
   root: {
      ...StyleSheet.absoluteFillObject,
      paddingVertical: 16,
   },
});

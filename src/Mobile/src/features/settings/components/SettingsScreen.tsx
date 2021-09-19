import { useNavigation } from '@react-navigation/core';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native';
import { RootNavigatorParamList } from 'src/RootNavigator';
import PersonalInfo from './personal-info/PersonalInfo';
import SettingsRoot from './SettingsRoot';

export type SettingsNavigatorParamList = {
   Home: undefined;
   PersonalInfo: undefined;
};

const Stack = createNativeStackNavigator();

export default function SettingsScreen() {
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
   const { t } = useTranslation();

   return (
      <Stack.Navigator>
         <Stack.Screen
            name="Root"
            component={SettingsRoot}
            options={{
               title: 'Settings',
               headerLeft: () => <Button title="Back" onPress={() => navigation.goBack()} />,
            }}
         />
         <Stack.Screen
            name="PersonalInfo"
            component={PersonalInfo}
            options={{ headerTitle: t('settings.personal_info.title') }}
         />
      </Stack.Navigator>
   );
}

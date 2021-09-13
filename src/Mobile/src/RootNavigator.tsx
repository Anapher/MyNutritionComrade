import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from './welcome/WelcomeScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
   return (
      <Stack.Navigator>
         <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
   );
}

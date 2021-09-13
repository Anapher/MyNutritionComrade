import { DefaultTheme, DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RootNavigator from './src/RootNavigator';
import { Provider as PaperProvider, DarkTheme as PaperDarkTheme } from 'react-native-paper';
import './src/services/i18n';

export default function App() {
   return (
      <PaperProvider theme={PaperDarkTheme}>
         <StatusBar style="light" />
         <NavigationContainer theme={DarkTheme}>
            <RootNavigator />
         </NavigationContainer>
      </PaperProvider>
   );
}

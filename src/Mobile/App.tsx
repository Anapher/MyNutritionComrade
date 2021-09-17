import { NavigationContainer, Theme as NavTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { DarkTheme, overlay, Provider as PaperProvider } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/types';
import { Provider } from 'react-redux';
import InitializeRepo from 'src/features/repo-manager/components/InitializeRepo';
import store from 'src/store';
import RootNavigator from './src/RootNavigator';
import './src/services/i18n';

const theme: Theme = {
   ...DarkTheme,
   roundness: 2,
   colors: {
      ...DarkTheme.colors,
      primary: '#2962ff',
      accent: '#e74c3c',
   },
};

const navigationTheme: NavTheme = {
   dark: true,
   colors: {
      background: theme.colors.background,
      border: '#fc0505',
      text: theme.colors.onSurface,
      primary: theme.colors.primary,
      card: overlay(4, theme.colors.surface) as string,
      notification: theme.colors.surface,
   },
};

export default function App() {
   return (
      <Provider store={store}>
         <PaperProvider theme={theme}>
            <StatusBar style="light" />
            <InitializeRepo />
            <NavigationContainer theme={navigationTheme}>
               <RootNavigator />
            </NavigationContainer>
         </PaperProvider>
      </Provider>
   );
}

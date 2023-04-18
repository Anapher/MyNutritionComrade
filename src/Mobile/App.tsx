import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer, Theme as NavTheme } from '@react-navigation/native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { MD3DarkTheme, overlay, Provider as PaperProvider, ThemeBase } from 'react-native-paper';
import { Provider } from 'react-redux';
import config from './src/config';
import InitializeRepo from 'src/features/repo-manager/components/InitializeRepo';
import store from './src/store';
import RootNavigator from './src/RootNavigator';
import './src/services/i18n';

axios.defaults.baseURL = config.writeRepository.baseUrl;

const theme: typeof MD3DarkTheme = {
   ...MD3DarkTheme,
   roundness: 2,
   colors: {
      ...MD3DarkTheme.colors,
      primary: '#2962ff',
      secondary: '#e74c3c',
      background: 'rgba(14, 13, 15, 1)',
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
         <ActionSheetProvider>
            <PaperProvider theme={theme}>
               <StatusBar style="light" />
               <InitializeRepo />
               <NavigationContainer theme={navigationTheme}>
                  <RootNavigator />
               </NavigationContainer>
            </PaperProvider>
         </ActionSheetProvider>
      </Provider>
   );
}

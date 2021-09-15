import { DefaultTheme, DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RootNavigator from './src/RootNavigator';
import { Provider as PaperProvider, DarkTheme as PaperDarkTheme } from 'react-native-paper';
import './src/services/i18n';
import { Provider } from 'react-redux';
import store from 'src/store';
import InitializeRepo from 'src/features/repo-manager/components/InitializeRepo';

export default function App() {
   return (
      <Provider store={store}>
         <PaperProvider theme={PaperDarkTheme}>
            <StatusBar style="light" />
            <InitializeRepo />
            <NavigationContainer theme={DarkTheme}>
               <RootNavigator />
            </NavigationContainer>
         </PaperProvider>
      </Provider>
   );
}

import { NavigationContainer } from '@react-navigation/native';
import { Theme as NavTheme } from '@react-navigation/native/lib/typescript/src/types';
import React from 'react';
import { DarkTheme, Provider as PaperProvider, Theme, overlay } from 'react-native-paper';
import { Provider } from 'react-redux';
import { getStore } from 'src/store';
import RootNavigator from './RootNavigator';

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
    },
};

export default function Main() {
    return (
        <Provider store={getStore()}>
            <PaperProvider theme={theme}>
                <NavigationContainer theme={navigationTheme}>
                    <RootNavigator />
                </NavigationContainer>
            </PaperProvider>
        </Provider>
    );
}

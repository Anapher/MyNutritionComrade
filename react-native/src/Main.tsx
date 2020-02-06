import React from 'react';
import { Provider } from 'react-redux';
import { getStore } from 'src/store';
import RootNavigator from './RootNavigator';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { DarkTheme as PaperDarkTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
    ...PaperDarkTheme,
    roundness: 2,
    colors: {
        ...PaperDarkTheme.colors,
        primary: '#2962ff',
        accent: '#bdbdbd',
    },
};

export default function Main() {
    return (
        <Provider store={getStore()}>
            <PaperProvider theme={theme}>
                <NavigationContainer theme={DarkTheme}>
                    <RootNavigator />
                </NavigationContainer>
            </PaperProvider>
        </Provider>
    );
}

import React from 'react';
import { Provider } from 'react-redux';
import { getStore } from 'src/store';
import RootNavigator from './RootNavigator';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';

export default function Main2() {
    return (
        <Provider store={getStore()}>
            <NavigationContainer theme={DarkTheme}>
                <RootNavigator />
            </NavigationContainer>
        </Provider>
    );
}

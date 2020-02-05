import Main from './src/Main';
import React from 'react';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';

export default function App() {
    return (
        <PaperProvider theme={DarkTheme}>
            <Main />
        </PaperProvider>
    );
}

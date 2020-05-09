import Axios from 'axios';
import { AppLoading } from 'expo';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import env from 'src/env';
import store, { rootPersistor } from 'src/store';
import Main from './src/Main';
import configure from 'src/startup';

configure(store);
Axios.defaults.baseURL = env.apiUrl;

function App() {
    return (
        <Provider store={store}>
            <PersistGate persistor={rootPersistor} loading={<AppLoading />}>
                <Main />
            </PersistGate>
        </Provider>
    );
}

export default App;

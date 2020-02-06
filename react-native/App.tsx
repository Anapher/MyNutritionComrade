import React, { useEffect, useState } from 'react';
import { loadStore, getStore } from 'src/store';
import Main from './src/Main';
import SplashScreen from './src/SplashScreen';
import configure from 'src/startup';
import Axios from 'axios';

Axios.defaults.baseURL = 'http://192.168.0.38:32423';

function App() {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        loadStore().then(() => {
            configure(getStore());
            setIsLoaded(true);
        });
    }, []);

    if (!isLoaded) {
        return <SplashScreen />;
    }

    return <Main />;
}

export default App;

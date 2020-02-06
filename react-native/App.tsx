import React, { useEffect, useState } from 'react';
import { loadStore } from 'src/store';
import Main from './src/Main';
import SplashScreen from './src/SplashScreen';

function App() {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        loadStore().then(() => setIsLoaded(true));
    }, []);

    if (!isLoaded) {
        return <SplashScreen />;
    }

    return <Main />;
}

export default App;

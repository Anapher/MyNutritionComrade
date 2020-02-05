import React, { useEffect, useState } from 'react';
import { loadStore } from 'src/store';
import Main2 from './Main2';
import SplashScreen from './SplashScreen';

function Main() {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        loadStore().then(() => setIsLoaded(true));
    }, []);

    if (!isLoaded) {
        return <SplashScreen />;
    }

    return <Main2 />;
}

export default Main;

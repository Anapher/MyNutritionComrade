import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Appbar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectIsFirstStart, selectSettingsLoaded } from './features/settings/selectors';
import WelcomeScreen from './features/welcome/WelcomeScreen';
import HomeScreen from './HomeScreen';

const Stack = createNativeStackNavigator();

export type RootNavigatorParamList = {
   Home: undefined;
   Welcome: undefined;
};

export default function RootNavigator() {
   const settingsLoaded = useSelector(selectSettingsLoaded);
   const isFirstStart = useSelector(selectIsFirstStart);

   if (!settingsLoaded) return null;

   return (
      <Stack.Navigator initialRouteName={isFirstStart ? 'Welcome' : 'Home'}>
         <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false, animationTypeForReplace: 'pop' }}
         />
         <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
               header: ({ navigation }) => (
                  <Appbar.Header>
                     <Appbar.Content title="My Nutrition Comrade" />
                     <Appbar.Action icon="cog" onPress={() => navigation.navigate('Settings')} />
                  </Appbar.Header>
               ),
            }}
         />
      </Stack.Navigator>
   );
}

import { createStackNavigator } from '@react-navigation/stack';
import { UserNutritionGoal, UserPersonalInfo } from 'Models';
import React from 'react';
import { StyleSheet } from 'react-native';
import SettingsNutritionGoals from './SettingsNutritionGoals';
import SettingsOverview from './SettingsOverview';
import { Appbar } from 'react-native-paper';
import SettingsPersonalInfo from './SettingsPersonalInfo';

export type SettingsStackParamList = {
    Home: undefined;
    ConfigureNutritionGoals: {
        initialValue: UserNutritionGoal;
        onSubmit: (newValue: UserNutritionGoal) => Promise<any>;
    };
    ConfigurePersonalInfo: {
        initialValue: UserPersonalInfo;
        onSubmit: (newValue: UserPersonalInfo) => Promise<any>;
    };
};

const Stack = createStackNavigator();

const Settings = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={SettingsOverview}
                options={{
                    header: ({ navigation }) => (
                        <Appbar.Header>
                            <Appbar.BackAction onPress={() => navigation.goBack()} />
                            <Appbar.Content title="Settings" />
                        </Appbar.Header>
                    ),
                }}
            />
            <Stack.Screen name="ConfigureNutritionGoals" component={SettingsNutritionGoals} />
            <Stack.Screen name="ConfigurePersonalInfo" component={SettingsPersonalInfo} />
        </Stack.Navigator>
    );
};

export default Settings;

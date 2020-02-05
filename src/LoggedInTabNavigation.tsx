import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import TabDiary from './TabDiary';
import TabAnalysis from './TabAnalysis';
import TabProfile from './TabProfile';

const Tab = createMaterialBottomTabNavigator();

export const BottomTabs = () => {
    return (
        <Tab.Navigator shifting={true} sceneAnimationEnabled={false}>
            <Tab.Screen
                name="Diary"
                component={TabDiary}
                options={{
                    tabBarIcon: 'book',
                }}
            />
            <Tab.Screen
                name="Analysis"
                component={TabAnalysis}
                options={{
                    tabBarIcon: 'chart-arc',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={TabProfile}
                options={{
                    tabBarIcon: 'account',
                }}
            />
        </Tab.Navigator>
    );
};

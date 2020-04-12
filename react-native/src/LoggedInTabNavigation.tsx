import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import TabDiary from './features/diary/components/TabDiary';
import TabWeight from './features/weight/components/TabWeight';
import TabAnalysis from './TabAnalysis';

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
                name="Weight"
                component={TabWeight}
                options={{
                    tabBarIcon: 'gauge',
                }}
            />
        </Tab.Navigator>
    );
};

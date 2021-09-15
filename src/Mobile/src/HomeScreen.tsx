import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React, { useEffect } from 'react';
import TabAnalysis from './features/analysis/components/TabAnalysis';
import TabDiary from './features/diary/components/TabDiary';
import DownloadRepoWhenRequired from './features/repo-manager/components/DownloadRepoWhenRequired';
import { withRepoStatus } from './features/repo-manager/components/RepositoryStatus';

const Tab = createMaterialBottomTabNavigator();

export default function HomeScreen() {
   return (
      <>
         <DownloadRepoWhenRequired />
         <Tab.Navigator>
            <Tab.Screen
               name="Diary"
               component={withRepoStatus(TabDiary)}
               options={{
                  tabBarIcon: 'book',
               }}
            />
            <Tab.Screen
               name="Analysis"
               component={withRepoStatus(TabAnalysis)}
               options={{
                  tabBarIcon: 'chart-arc',
               }}
            />
         </Tab.Navigator>
      </>
   );
}

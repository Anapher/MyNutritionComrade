import React from 'react';
import { View } from 'react-native';
import FoodList from './components/FoodList';

export default function TabDiary() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <FoodList />
        </View>
    );
}

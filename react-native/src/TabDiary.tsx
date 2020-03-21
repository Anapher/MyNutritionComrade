import React from 'react';
import { View } from 'react-native';
import FoodList from './components/FoodList';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './RootNavigator';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
};

export default function TabDiary({ navigation }: Props) {
    return (
        <View style={{ marginTop: 16 }}>
            <FoodList
                title="Lunch"
                items={[
                    {
                        name: 'Haferflocken',
                        amount: '76g',
                        carbohydrates: 50,
                        fat: 0,
                        kcal: 200,
                        protein: 20,
                        sugars: 0,
                    },
                    {
                        name: 'Milch',
                        amount: '250ml',
                        carbohydrates: 12,
                        fat: 20,
                        kcal: 400,
                        protein: 10,
                        sugars: 3,
                    },
                ]}
                onAddFood={() => navigation.navigate('SearchProduct', { mealType: 'Lunch' })}
                onScanBarcode={() => {}}
                onMoreOptions={() => {}}
            />
        </View>
    );
}

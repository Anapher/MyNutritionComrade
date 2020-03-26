import React from 'react';
import { View } from 'react-native';
import FoodList from './FoodList';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/RootNavigator';
import { RootState } from 'MyNutritionComrade';
import { connect } from 'react-redux';
import { ConsumptionTime } from 'Models';

const mapStateToProps = (state: RootState) => ({
    currrentDate: state.diary.currentDate,
    consumedProducts: state.diary.consumedProducts,
});

type Props = ReturnType<typeof mapStateToProps> & {
    navigation: StackNavigationProp<RootStackParamList>;
};

const consumptionTimes: ConsumptionTime[] = ['Breakfast', 'Lunch', 'Breakfast', 'Snack'];

function TabDiary({ navigation, currrentDate, consumedProducts }: Props) {
    return (
        <View style={{ marginTop: 16 }}>
            {consumptionTimes.map((x) => (
                <FoodList
                    key={x}
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
                    onAddFood={() => navigation.navigate('SearchProduct', { consumptionTime: 'Lunch' })}
                    onScanBarcode={() => {}}
                    onMoreOptions={() => {}}
                />
            ))}
        </View>
    );
}

export default connect(mapStateToProps)(TabDiary);

import React from 'react';
import FoodList from './FoodList';
import { ConsumptionTime } from 'Models';
import { RootState } from 'MyNutritionComrade';
import { connect } from 'react-redux';
import * as selectors from '../selectors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/RootNavigator';

const timeTitles: { [time in ConsumptionTime]: string } = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
};

type UserProps = {
    time: ConsumptionTime;
    navigation: StackNavigationProp<RootStackParamList>;
};

const mapStateToProps = (state: RootState, props: UserProps) => ({
    currentDate: state.diary.currentDate,
    consumedProducts: selectors.getConsumedProducts(state, props),
});

type Props = ReturnType<typeof mapStateToProps> & UserProps;

function ConsumedProducts({ time, currentDate, consumedProducts, navigation }: Props) {
    return (
        <FoodList
            title={timeTitles[time]}
            items={consumedProducts}
            onAddFood={() => navigation.navigate('SearchProduct', { consumptionTime: time, date: currentDate })}
            onScanBarcode={() => {}}
            onMoreOptions={() => {}}
        />
    );
}

export default connect(mapStateToProps)(ConsumedProducts);

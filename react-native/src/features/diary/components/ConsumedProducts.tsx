import React from 'react';
import FoodList from './FoodList';
import { ConsumptionTime } from 'Models';
import { RootState } from 'MyNutritionComrade';
import { connect } from 'react-redux';

const timeTitles: { [time in ConsumptionTime]: string } = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
};

const mapStateToProps = (state: RootState) => ({
    currentDate: state.diary.currentDate,
});

type Props = ReturnType<typeof mapStateToProps> & {
    time: ConsumptionTime;
};

function ConsumedProducts({ time, currentDate }: Props) {
    return (
        <FoodList
            title={timeTitles[time]}
            items={consumedProducts.filter((x) => x.time === time && x.day == currentDate)}
            onAddFood={() => navigation.navigate('SearchProduct', { consumptionTime: time, date: currentDate })}
            onScanBarcode={() => {}}
            onMoreOptions={() => {}}
        />
    );
}

export default connect(mapStateToProps)(ConsumedProducts);

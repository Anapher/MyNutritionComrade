import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { ConsumptionTimes } from 'src/consts';
import { RootStackParamList } from 'src/RootNavigator';
import * as actions from '../actions';
import FoodList from './FoodList';

const mapStateToProps = (state: RootState) => ({
    currrentDate: state.diary.currentDate,
    consumedProducts: state.diary.consumedProducts,
});

const dispatchProps = {
    loadFrequentlyUsedProducts: actions.loadFrequentlyUsedProducts.request,
};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps & {
        navigation: StackNavigationProp<RootStackParamList>;
    };

function TabDiary({ navigation, currrentDate, consumedProducts, loadFrequentlyUsedProducts }: Props) {
    useEffect(() => {
        loadFrequentlyUsedProducts(null);
    }, []);

    return (
        <View style={{ marginTop: 16 }}>
            {ConsumptionTimes.map((time) => (
                <View key={time} style={{ marginBottom: 16 }}>
                    <FoodList
                        title={time}
                        items={consumedProducts.filter((x) => x.time === time)}
                        onAddFood={() => navigation.navigate('SearchProduct', { consumptionTime: time })}
                        onScanBarcode={() => {}}
                        onMoreOptions={() => {}}
                    />
                </View>
            ))}
        </View>
    );
}

export default connect(mapStateToProps, dispatchProps)(TabDiary);

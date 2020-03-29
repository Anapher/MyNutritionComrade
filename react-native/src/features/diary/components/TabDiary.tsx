import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { ConsumptionTimes } from 'src/consts';
import { RootStackParamList } from 'src/RootNavigator';
import * as actions from '../actions';
import FoodList from './FoodList';
import { ConsumptionTime } from 'Models';
import _ from 'lodash';
import { toDateString } from 'src/utils/date-helper';

const mapStateToProps = (state: RootState) => ({
    currrentDate: state.diary.currentDate,
    consumedProducts: state.diary.consumedProducts,
});

const dispatchProps = {
    loadFrequentlyUsedProducts: actions.loadFrequentlyUsedProducts.request,
    loadDate: actions.loadDate.request,
};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps & {
        navigation: StackNavigationProp<RootStackParamList>;
    };

function TabDiary({ navigation, currrentDate, consumedProducts, loadFrequentlyUsedProducts, loadDate }: Props) {
    useEffect(() => {
        loadFrequentlyUsedProducts();
        loadDate(toDateString(new Date()));
    }, []);

    return (
        <View style={{ marginTop: 16 }}>
            {ConsumptionTimes.map((time) => (
                <View key={time} style={{ marginBottom: 16 }}></View>
            ))}
        </View>
    );
}

export default connect(mapStateToProps, dispatchProps)(TabDiary);

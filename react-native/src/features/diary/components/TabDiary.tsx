import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { ConsumptionTimes } from 'src/consts';
import { RootStackParamList } from 'src/RootNavigator';
import { toDateString } from 'src/utils/string-utils';
import * as actions from '../actions';
import ConsumedProducts from './ConsumedProducts';

const dispatchProps = {
    loadFrequentlyUsedProducts: actions.loadFrequentlyUsedProducts.request,
    loadDate: actions.loadDate.request,
};

type Props = typeof dispatchProps & {
    navigation: StackNavigationProp<RootStackParamList>;
};

function TabDiary({ navigation, loadFrequentlyUsedProducts, loadDate }: Props) {
    useEffect(() => {
        loadFrequentlyUsedProducts();
        loadDate(toDateString(new Date()));
    }, []);

    return (
        <View style={{ marginTop: 16 }}>
            {ConsumptionTimes.map((time) => (
                <View key={time} style={{ marginBottom: 16 }}>
                    <ConsumedProducts time={time} navigation={navigation} />
                </View>
            ))}
        </View>
    );
}

export default connect(undefined, dispatchProps)(TabDiary);

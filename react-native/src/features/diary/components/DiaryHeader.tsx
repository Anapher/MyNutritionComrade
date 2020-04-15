import { RootState } from 'MyNutritionComrade';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Surface } from 'react-native-paper';
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as selectors from '../selectors';
import DateControls from './DateControls';
import NutritionSummary from './NutritionSummary';

const mapStateToProps = (state: RootState) => ({
    consumedProducts: selectors.getConsumedProducts(state),
    selectedDate: state.diary.selectedDate,
});

const dispatchProps = {
    loadDate: actions.setSelectedDate.request,
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

function DiaryHeader({ consumedProducts, selectedDate, loadDate }: Props) {
    return (
        <Surface style={styles.surface}>
            <DateControls selectedDate={selectedDate} onChange={(d) => loadDate(d)} />
            <Divider />
            <View style={styles.summary}>
                <NutritionSummary products={consumedProducts} />
            </View>
        </Surface>
    );
}

export default connect(mapStateToProps, dispatchProps)(DiaryHeader);

const styles = StyleSheet.create({
    surface: {
        elevation: 12,
    },
    summary: {
        marginVertical: 8,
    },
});

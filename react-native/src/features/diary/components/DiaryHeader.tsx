import { RootState } from 'MyNutritionComrade';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as selectors from '../selectors';
import DateControls from './DateControls';
import NutritionSummary from './NutritionSummary';
import { Surface, Divider, useTheme } from 'react-native-paper';
import Color from 'color';

const mapStateToProps = (state: RootState) => ({
    consumedProducts: selectors.getConsumedProducts(state),
    currentDate: state.diary.currentDate,
});

const dispatchProps = {
    loadDate: actions.loadDate.request,
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

function DiaryHeader({ consumedProducts, currentDate, loadDate }: Props) {
    return (
        <Surface style={styles.surface}>
            <DateControls selectedDate={currentDate} onChange={(d) => loadDate(d)} />
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

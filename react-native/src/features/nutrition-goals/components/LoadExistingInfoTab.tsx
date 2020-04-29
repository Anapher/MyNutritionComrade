import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootState } from 'MyNutritionComrade';
import * as actions from '../actions';
import { Button } from 'react-native-paper';
import ConfigureNutritionGoals from './ConfigureNutritionGoals';
import { connect } from 'react-redux';

const mapStateToProps = (state: RootState) => ({
    isLoading: state.nutritionGoals.isLoading,
    data: state.nutritionGoals.nutritionGoal,
    error: state.nutritionGoals.error,
});

const dispatchProps = {
    loadCurrentNutritionGoal: actions.loadCurrentNutritionGoal.request,
};

type Props = {} & ReturnType<typeof mapStateToProps> & typeof dispatchProps;

function LoadExistingInfoTab({ isLoading, data, error, loadCurrentNutritionGoal }: Props) {
    useEffect(() => {
        loadCurrentNutritionGoal();
    }, []);

    if (isLoading)
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );

    if (error)
        return (
            <View>
                <Text>An error occurred loading the current data...</Text>
                <Button onPress={loadCurrentNutritionGoal}>Try again</Button>
            </View>
        );

    return <ConfigureNutritionGoals initialValue={data || {}} />;
}

export default connect(mapStateToProps, dispatchProps)(LoadExistingInfoTab);

const styles = StyleSheet.create({});

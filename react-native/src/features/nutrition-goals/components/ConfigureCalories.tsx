import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, RadioButton } from 'react-native-paper';
import { UserNutritionGoal } from 'Models';
import { GoalConfigProps } from './ConfigureNutritionGoals';

const ConfigureCalories = ({ data, onChange }: GoalConfigProps) => {
    return (
        <View>
            <View style={styles.linearView}>
                <RadioButton.Item
                    style={styles.fillFlex}
                    label="Fixed value"
                    status={data.calories?.type === 'caloriesFixed' ? 'checked' : 'unchecked'}
                    value="caloriesFixed"
                />
                <RadioButton.Item
                    style={styles.fillFlex}
                    label="Mifflin-St. Jeor Equation"
                    status={data.calories?.type === 'caloriesMifflinStJeor' ? 'checked' : 'unchecked'}
                    value="caloriesMifflinStJeor"
                />
            </View>
            <Text>asdasd</Text>
        </View>
    );
};

export default ConfigureCalories;

const styles = StyleSheet.create({
    linearView: {
        display: 'flex',
        flexDirection: 'row',
    },
    fillFlex: {},
});

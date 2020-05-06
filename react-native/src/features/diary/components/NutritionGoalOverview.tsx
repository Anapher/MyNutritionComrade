import { ComputedNutritionGoals, NutritionalInfo } from 'Models';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Tile from './Tile';

type GoalTileProps = {
    name: string;
    value: number;
    unit: string;
    targetValue: number;
};

function GoalTile({ name, targetValue, value, unit }: GoalTileProps) {
    const progress = targetValue / value;
    const color = progress > 95 ? 'green' : progress > 50 ? 'yellow' : 'red';
    const left = targetValue - value;

    return <Tile caption={`Target: ${targetValue}${unit}`} value={`${left}${unit}`} valueColor={color} text={name} />;
}

type Props = {
    nutritionGoal: ComputedNutritionGoals | null;
    nutritions: NutritionalInfo;
};

function NutritionGoalOverview({ nutritionGoal, nutritions }: Props) {
    return (
        <View style={styles.root}>
            {nutritionGoal?.caloriesPerDay && (
                <GoalTile
                    name="Energy"
                    targetValue={nutritionGoal.caloriesPerDay}
                    unit=" kcal"
                    value={nutritions.energy}
                />
            )}
            {nutritionGoal?.proteinPerDay && (
                <GoalTile
                    name="Protein"
                    targetValue={nutritionGoal.proteinPerDay}
                    unit="g"
                    value={nutritions.protein}
                />
            )}
        </View>
    );
}

export default NutritionGoalOverview;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

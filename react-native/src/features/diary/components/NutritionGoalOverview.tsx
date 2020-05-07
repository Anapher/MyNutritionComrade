import { ComputedNutritionGoals, NutritionalInfo } from 'Models';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Tile from './Tile';
import { roundNumber } from 'src/utils/string-utils';
import { Text } from 'react-native-paper';

type GoalTileProps = {
    name: string;
    value: number;
    unit: string;
    targetValue: number;
};

function GoalTile({ name, targetValue, value, unit }: GoalTileProps) {
    const progress = value / targetValue;
    const color = progress > 95 ? '#27ae60' : progress > 50 ? '#e67e22' : '#e74c3c';
    const left = targetValue - value;

    return (
        <Tile
            caption={`${(progress * 100).toFixed(1)}%`}
            value={`${roundNumber(left)}${unit}`}
            valueColor={color}
            text={name}
            style={{ marginLeft: 32 }}
        />
    );
}

type Props = {
    nutritionGoal: ComputedNutritionGoals | null;
    nutritions: NutritionalInfo;
};

function NutritionGoalOverview({ nutritionGoal, nutritions }: Props) {
    return (
        <View style={styles.root}>
            <View style={styles.container}>
                <Tile value="Missing:" caption="Reached:" text=" " style={{ alignItems: 'flex-end' }} />
                <View style={styles.container}>
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
            </View>
        </View>
    );
}

export default NutritionGoalOverview;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
});

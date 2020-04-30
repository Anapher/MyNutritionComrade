import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GoalConfigProps } from './ConfigureNutritionGoals';
import NumberTextInput from './NumberTextInput';
import { NutrientDistribution } from 'Models';
import { Text, useTheme } from 'react-native-paper';

const NutrientDistributionView = ({
    data,
    onChange,
}: {
    data: NutrientDistribution;
    onChange: (x: NutrientDistribution) => void;
}) => {
    const sum = data.carbohydrates + data.fat + data.protein;
    const error = sum !== 1;
    const theme = useTheme();

    return (
        <View>
            <View style={styles.container}>
                <NumberTextInput
                    error={error}
                    style={styles.flex}
                    label="Carbs"
                    value={data.carbohydrates}
                    onChangeValue={(x) => onChange({ ...data, carbohydrates: x })}
                />
                <NumberTextInput
                    error={error}
                    style={[styles.flex, { marginHorizontal: 16 }]}
                    label="Fat"
                    value={data.fat}
                    onChangeValue={(x) => onChange({ ...data, fat: x })}
                />
                <NumberTextInput
                    error={error}
                    style={styles.flex}
                    label="Protein"
                    value={data.protein}
                    onChangeValue={(x) => onChange({ ...data, protein: x })}
                />
            </View>
            {error && (
                <Text style={{ color: theme.colors.error, marginHorizontal: 16, marginVertical: 8 }}>
                    The nutrients must sum to exactly 1 (100%). Current sum: {sum}
                </Text>
            )}
        </View>
    );
};

const ConfigureNutrientDistribution = ({ data, onChange }: GoalConfigProps) => {
    if (data.distribution === undefined || data.distribution.type !== 'proportionalDistribution') return null;

    return (
        <NutrientDistributionView data={data.distribution} onChange={(x) => onChange({ ...data, distribution: x })} />
    );
};

export default ConfigureNutrientDistribution;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        marginHorizontal: 16,
        marginVertical: 8,
    },
    flex: {
        flex: 1,
    },
});

import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Title, Paragraph, useTheme, Divider } from 'react-native-paper';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { SettingsStackParamList } from '../Settings';
import useAsyncFunction from 'src/hooks/use-async-function';
import itiriri from 'itiriri';
import { Text } from 'react-native-paper';
import { UserNutritionGoal } from 'Models';
import Color from 'color';

const mapStateToProps = (state: RootState) => ({
    isLoading: state.settings.isLoadingNutritionGoal,
    data: state.settings.nutritionGoal,
    error: state.settings.errorNutritionGoal,
});

const dispatchProps = {
    loadCurrentNutritionGoal: actions.loadCurrentNutritionGoal.request,
};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps & {
        navigation: StackNavigationProp<SettingsStackParamList>;
    };

// function generatePatch<T>(oldObj: T, newObj: T): Partial<T> {
//     const patch: Partial<T> = {};

//     for (const k of itiriri([...Object.keys(oldObj), ...Object.keys(newObj)]).distinct()) {
//         const oldValue = (oldObj as any)[k];
//         const newValue = (newObj as any)[k];

//         if (oldValue === newValue) continue;
//         if (JSON.stringify(oldValue) === JSON.stringify(newValue)) continue;

//         (patch as any)[k] = newValue;
//     }

//     return patch;
// }

function Highlight({ children }: { children: any }) {
    const theme = useTheme();

    return <Text style={{ color: theme.colors.accent }}>{children}</Text>;
}

function CaloriesInfo({ data: { calories } }: { data: UserNutritionGoal }) {
    if (!calories) {
        return null;
    }

    if (calories.type === 'caloriesFixed')
        return (
            <Paragraph>
                Calories per day: <Highlight>{calories.caloriesPerDay}</Highlight> kcal
            </Paragraph>
        );
    if (calories.type === 'caloriesMifflinStJeor')
        return (
            <Paragraph>
                Calories calculated by the Mifflin-St. Jeor Equation.{'\n'}Activity Level:{' '}
                <Highlight>{calories.palFactor}</Highlight>
                {'\n'}
                <Highlight>
                    {calories.calorieOffset < 0 ? '' : '+'}
                    {calories.calorieOffset}
                </Highlight>{' '}
                kcal (offset){'\n'}
                <Highlight>
                    {calories.calorieBalance < 0 ? '' : '+'}
                    {calories.calorieBalance}
                </Highlight>{' '}
                kcal (balance)
            </Paragraph>
        );

    return null;
}

function ProteinInfo({ data: { protein } }: { data: UserNutritionGoal }) {
    if (!protein) {
        return null;
    }

    if (protein.type === 'proteinFixed') {
        return (
            <Paragraph>
                Protein per day: <Highlight>{protein.proteinPerDay}</Highlight>g
            </Paragraph>
        );
    }

    if (protein.type === 'proteinByBodyweight') {
        return (
            <Paragraph>
                Protein per day: <Highlight>{protein.proteinPerKgBodyweight}</Highlight>g/kg
            </Paragraph>
        );
    }

    return null;
}

function NutrientDistributionInfo({ data: { distribution } }: { data: UserNutritionGoal }) {
    if (!distribution) {
        return null;
    }

    if (distribution.type === 'proportionalDistribution') {
        return (
            <Paragraph>
                Distribution: <Highlight>{distribution.carbohydrates * 100}%</Highlight> carbohydrates,{' '}
                <Highlight>{distribution.protein * 100}%</Highlight> protein,{' '}
                <Highlight>{distribution.fat * 100}%</Highlight> fat
            </Paragraph>
        );
    }

    return null;
}

function Widget({ loadCurrentNutritionGoal, isLoading, error, data, navigation }: Props) {
    useEffect(() => {
        loadCurrentNutritionGoal();
    }, []);

    const theme = useTheme();

    const patchAction = useAsyncFunction(
        actions.patchNutritionGoal.request,
        actions.patchNutritionGoal.success,
        actions.patchNutritionGoal.failure,
    );

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

    if (!data) return null;

    return (
        <Card>
            <Card.Content>
                <Title>Nutrition Goals</Title>
                <CaloriesInfo data={data} />
                {data.protein && (
                    <Divider
                        style={{ marginVertical: 8, backgroundColor: Color(theme.colors.text).alpha(0.6).string() }}
                    />
                )}
                <ProteinInfo data={data} />
                {data.distribution && (
                    <Divider
                        style={{ marginVertical: 8, backgroundColor: Color(theme.colors.text).alpha(0.6).string() }}
                    />
                )}
                <NutrientDistributionInfo data={data} />
            </Card.Content>
            <Card.Actions>
                <Button
                    onPress={() =>
                        navigation.navigate('ConfigureNutritionGoals', {
                            initialValue: data,
                            onSubmit: (goal) => {
                                return patchAction!(goal);
                            },
                        })
                    }
                >
                    Adjust
                </Button>
            </Card.Actions>
        </Card>
    );
}

export default connect(mapStateToProps, dispatchProps)(Widget);

const styles = StyleSheet.create({});

import { StackNavigationProp } from '@react-navigation/stack';
import Color from 'color';
import { UserNutritionGoal } from 'Models';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Divider, Paragraph, Title, useTheme } from 'react-native-paper';
import Highlight from '../Highlight';
import { SettingsStackParamList } from '../Settings';

type Props = {
    navigation: StackNavigationProp<SettingsStackParamList>;
    data: UserNutritionGoal;
    onChange: (newValue: UserNutritionGoal) => Promise<any>;
};

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

function Widget({ navigation, data, onChange }: Props) {
    const theme = useTheme();

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
                            onSubmit: onChange,
                        })
                    }
                >
                    Adjust
                </Button>
            </Card.Actions>
        </Card>
    );
}

export default Widget;

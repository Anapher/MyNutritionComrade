import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Meal } from 'Models';
import { Text } from 'react-native-paper';

type Props = {
    meal: Meal;
    onOptions: () => void;
    onEdit: () => void;
};

function MealItem({ meal }: Props) {
    return (
        <View>
            <Text>{meal.name}</Text>
        </View>
    );
}

export default MealItem;

const styles = StyleSheet.create({});

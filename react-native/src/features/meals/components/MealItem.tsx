import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Meal } from 'Models';

type Props = {
    meal: Meal;
    onOptions: () => void;
    onEdit: () => void;
};

function MealItem({ meal }: Props) {
    return (
        <View>
            <Text></Text>
        </View>
    );
}

export default MealItem;

const styles = StyleSheet.create({});

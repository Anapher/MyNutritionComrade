import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import FoodButtons from './FoodButtons';

const styles = StyleSheet.create({
    surface: {
        width: '100%',
        elevation: 2,
    },
});

export default function FoodList() {
    return (
        <Surface style={styles.surface}>
            <Text>Mittagessen</Text>
            <FoodButtons />
        </Surface>
    );
}

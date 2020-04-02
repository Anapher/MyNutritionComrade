import React from 'react';
import { StyleProp, ViewStyle, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
    removed?: boolean;
    value: string;
    style?: StyleProp<ViewStyle>;
};

export default function ChangedValue({ removed, value, style }: Props) {
    return (
        <View style={[styles.root, removed && styles.removedRoot, style]}>
            <Text style={[removed && styles.removedText]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        paddingHorizontal: 2,
        borderRadius: 5,
        backgroundColor: 'rgba(46, 204, 113, 0.3)',
    },
    removedRoot: {
        backgroundColor: 'rgba(231, 76, 60, 0.3)',
    },
    removedText: {
        textDecorationLine: 'line-through',
    },
});

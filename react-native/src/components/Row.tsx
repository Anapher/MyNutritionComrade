import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Caption } from 'react-native-paper';
import { errorColor } from 'src/consts';

const styles = StyleSheet.create({
    root: {
        padding: 8,
    },
    nameValue: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        alignItems: 'center',
    },
    middleRow: {
        borderBottomWidth: 1,
        borderBottomColor: 'red',
    },
});

export type RowProps = {
    name: React.ReactNode;
    children?: React.ReactNode;
    lastItem?: boolean;
    description?: string;
    error?: string;
};

export default function Row({ name, children, lastItem, description, error }: RowProps) {
    return (
        <View style={styles.root}>
            <View style={[styles.nameValue, !lastItem && styles.middleRow]}>
                {name}
                {children}
            </View>
            {description && <Caption>{description}</Caption>}
            {error && <Caption style={{ color: errorColor }}>{error}</Caption>}
        </View>
    );
}

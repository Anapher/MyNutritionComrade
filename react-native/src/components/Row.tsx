import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Caption, useTheme } from 'react-native-paper';

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
    const theme = useTheme();
    return (
        <View style={styles.root}>
            <View style={[styles.nameValue, !lastItem && styles.middleRow]}>
                {name}
                {children}
            </View>
            {description && <Caption>{description}</Caption>}
            {error && <Caption style={{ color: theme.colors.error }}>{error}</Caption>}
        </View>
    );
}

import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 8,
        alignItems: 'center',
    },
    middleRow: {
        borderBottomWidth: 1,
        borderBottomColor: 'red',
    },
});

type RowProps = {
    name: React.ReactNode;
    children: React.ReactNode;
    lastItem?: boolean;
};
export default function Row({ name, children, lastItem }: RowProps) {
    return (
        <View style={[styles.root, !lastItem && styles.middleRow]}>
            {name}
            {children}
        </View>
    );
}

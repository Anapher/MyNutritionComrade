import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export type OperationType = 'add' | 'modify' | 'remove' | 'initialize';
const operationTypeStyles: {
    [key in OperationType]: {
        title: string;
        color: string;
    };
} = {
    add: {
        title: 'Add',
        color: '#27ae60',
    },
    remove: {
        title: 'Remove',
        color: '#c0392b',
    },
    modify: {
        title: 'Modify',
        color: '#2980b9',
    },
    initialize: {
        title: 'Initialize',
        color: '#8e44ad',
    },
};

function OperationHeader({ type, propertyName }: { type: OperationType; propertyName: string }) {
    const theme = useTheme();
    return (
        <View style={styles.operationHeader}>
            <View style={[styles.chip, { backgroundColor: operationTypeStyles[type].color }]}>
                <Text style={styles.chipText}>{operationTypeStyles[type].title}</Text>
            </View>
            <Text style={[styles.operationHeaderPropertyName, { color: theme.colors.text }]}>{propertyName}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    operationHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    operationHeaderPropertyName: {
        marginLeft: 8,
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.5,
    },
    chip: {
        borderRadius: 10,
        borderWidth: 0,
        paddingHorizontal: 8,
        paddingVertical: 2,
        width: 64,
        display: 'flex',
        alignItems: 'center',
    },
    chipText: {
        color: 'white',
        fontSize: 12,
    },
});

export default OperationHeader;

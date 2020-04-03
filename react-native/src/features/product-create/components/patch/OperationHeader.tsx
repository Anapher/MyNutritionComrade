import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type OperationType = 'add' | 'modify' | 'remove';
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
};

function OperationHeader({ type, propertyName }: { type: OperationType; propertyName: string }) {
    return (
        <View style={styles.operationHeader}>
            <View style={[styles.chip, { backgroundColor: operationTypeStyles[type].color }]}>
                <Text style={styles.chipText}>{operationTypeStyles[type].title}</Text>
            </View>
            <Text style={styles.operationHeaderPropertyName}>{propertyName}</Text>
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
        width: 60,
        display: 'flex',
        alignItems: 'center',
    },
    chipText: {
        color: 'white',
        fontSize: 12,
    },
});

export default OperationHeader;

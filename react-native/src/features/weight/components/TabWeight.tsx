import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';

const TabWeight = () => {
    return (
        <View style={styles.root}>
            <View style={{ backgroundColor: 'gray', height: 200 }} />
            <FAB style={styles.fab} icon="plus" onPress={() => {}} />
        </View>
    );
};

export default TabWeight;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        height: '100%',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

type Props = {
    info?: string;
};
const LoadingOverlay = ({ info }: Props) => {
    return (
        <View style={styles.root}>
            <ActivityIndicator />
            <Text style={styles.text}>{info}</Text>
        </View>
    );
};

export default LoadingOverlay;

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        marginLeft: 16,
    },
});

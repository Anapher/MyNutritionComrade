import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LoggedWeight } from 'Models';
import { DateTime } from 'luxon';
import { Text, TouchableRipple } from 'react-native-paper';

type Props = {
    data: LoggedWeight;
    onOptions: () => void;
};

function LoggedWeightItem({ data: { timestamp, value }, onOptions }: Props) {
    const date = DateTime.fromISO(timestamp);

    return (
        <TouchableRipple onLongPress={onOptions} onPress={() => {}}>
            <View style={styles.root}>
                <Text style={styles.dateText}>{date.toLocaleString(DateTime.DATETIME_HUGE)}</Text>
                <Text>
                    <Text style={styles.weightValueText}>{value}</Text>kg
                </Text>
            </View>
        </TouchableRipple>
    );
}

export default LoggedWeightItem;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: 'center',
    },
    dateText: {
        fontSize: 13,
    },
    weightValueText: {
        fontSize: 24,
    },
});

import { DateTime } from 'luxon';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import FlatButton from 'src/components/FlatButton';
import FlatIconButton from 'src/components/FlatIconButton';

type Props = {
    selectedDate: string;
    onChange: (d: string) => void;
};

function DateControls({ selectedDate, onChange }: Props) {
    const dateTime = DateTime.fromISO(selectedDate);

    return (
        <View style={styles.root}>
            <FlatIconButton
                icon="arrow-left"
                onPress={() => onChange(dateTime.minus({ days: 1 }).toISODate())}
                margin={2}
            />
            <FlatButton
                onPress={() => {}}
                text={dateTime.toLocaleString(DateTime.DATE_HUGE)}
                style={{ flex: 1 }}
                center
            />
            {
                <FlatIconButton
                    icon="arrow-right"
                    onPress={() => onChange(dateTime.plus({ days: 1 }).toISODate())}
                    margin={2}
                    disabled={dateTime.hasSame(DateTime.local(), 'day')}
                />
            }
        </View>
    );
}

export default DateControls;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'row',
    },
});

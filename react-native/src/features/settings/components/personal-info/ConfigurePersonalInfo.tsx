import React from 'react';
import { StyleSheet, View } from 'react-native';
import { UserPersonalInfo } from 'Models';
import { Text, TextInput } from 'react-native-paper';
import TextToggleButton from 'src/components/TextToggleButton';
import NumberTextInput from '../NumberTextInput';
import { DateTime } from 'luxon';

type Props = {
    value: UserPersonalInfo;
    onChange: (data: UserPersonalInfo) => void;
};

function ConfigurePersonalInfo({ value, onChange }: Props) {
    const age = -(value.birthday ? DateTime.fromISO(value.birthday).diffNow('years').years : 0).toFixed(0);

    return (
        <View style={styles.root}>
            <Text>Gender</Text>
            <View style={styles.toggleContainer}>
                <TextToggleButton
                    isChecked={value.gender === 'female'}
                    isLeft
                    onToggle={() => onChange({ ...value, gender: 'female' })}
                    style={styles.toggleButton}
                >
                    <Text>Female</Text>
                </TextToggleButton>
                <TextToggleButton
                    isChecked={value.gender === 'male'}
                    isRight
                    onToggle={() => onChange({ ...value, gender: 'male' })}
                    style={[styles.toggleButton, styles.toggleButtonRight]}
                >
                    <Text>Male</Text>
                </TextToggleButton>
            </View>
            <NumberTextInput
                style={styles.viewItem}
                label="Height (cm)"
                value={value.height !== undefined ? value.height * 100 : 0}
                onChangeValue={(x) => onChange({ ...value, height: x / 100 })}
            />
            <NumberTextInput
                style={styles.viewItem}
                label="Age"
                value={age}
                onChangeValue={(x) => onChange({ ...value, birthday: DateTime.utc().minus({ years: x }).toISODate() })}
            />
        </View>
    );
}

export default ConfigurePersonalInfo;

const styles = StyleSheet.create({
    root: {
        padding: 16,
    },
    toggleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    toggleButton: {
        width: 96,
    },
    toggleButtonRight: {
        marginLeft: 2,
    },
    viewItem: {
        marginTop: 16,
    },
});

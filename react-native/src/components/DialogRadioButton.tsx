import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RadioButton, Subheading, TouchableRipple } from 'react-native-paper';

type Props = {
    checked?: boolean;
    onPress?: () => any;
    label?: string;
};

const DialogRadioButton = ({ onPress, checked, label }: Props) => {
    return (
        <TouchableRipple onPress={onPress}>
            <View style={styles.row}>
                <View pointerEvents="none">
                    <RadioButton value="" status={checked === true ? 'checked' : 'unchecked'} />
                </View>
                <Subheading style={styles.text}>{label}</Subheading>
            </View>
        </TouchableRipple>
    );
};

export default DialogRadioButton;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    text: {
        paddingLeft: 8,
    },
});

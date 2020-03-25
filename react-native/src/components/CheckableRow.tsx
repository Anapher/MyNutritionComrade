import React from 'react';
import Row, { RowProps } from './Row';
import { View } from 'react-native';
import { RadioButton, TouchableRipple } from 'react-native-paper';

type CheckableRowProps = RowProps & {
    checked: boolean;
    onPress?: () => void;
    disabled?: boolean;
};

export default function CheckableRow({ checked, onPress, disabled, ...other }: CheckableRowProps) {
    return (
        <TouchableRipple onPress={onPress} disabled={disabled}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton
                    status={checked ? 'checked' : 'unchecked'}
                    value=""
                    onPress={onPress}
                    disabled={disabled}
                />
                <View style={{ flex: 1, marginLeft: 8 }}>
                    <Row {...other} />
                </View>
            </View>
        </TouchableRipple>
    );
}

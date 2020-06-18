import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useTheme, TextInput } from 'react-native-paper';
import _ from 'lodash';

type Props = Omit<React.ComponentProps<typeof TextInput>, 'value'> & {
    value: string[];
    onChangeValue: (newVal: string[]) => void;
    onChangeState?: (isValid: boolean) => void;
};

const formatValue = (val: string[]) => val.join(', ');
const parseValue = (val: string) =>
    val
        .split(',')
        .map((x) => x.trim())
        .filter((x) => !!x);
const compareValue = (v1: string[], v2: string[]) => _.isEqual(v1, v2);

export default function TagInput({ value, onChangeValue, onChangeState, style, ...props }: Props) {
    const [displayText, setDisplayText] = useState(formatValue(value));
    const theme = useTheme();

    useLayoutEffect(() => {
        const s = formatValue(value);
        if (displayText !== s) {
            if (parseValue(displayText) === value) return;
            setDisplayText(s);
        }
    }, [value]);

    const isApplied = parseValue(displayText) === value;

    useEffect(() => {
        if (onChangeState) onChangeState(isApplied);
    }, [isApplied]);

    return (
        <TextInput
            value={displayText}
            onChangeText={(s) => {
                setDisplayText(s);
                const val = parseValue(s);
                if (!compareValue(val, value)) {
                    onChangeValue(val);
                }
            }}
            style={[!isApplied && { color: theme.colors.error }, style]}
            {...props}
        />
    );
}

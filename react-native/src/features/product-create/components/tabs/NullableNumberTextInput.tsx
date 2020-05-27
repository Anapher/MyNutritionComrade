import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';

type Props = Omit<React.ComponentProps<typeof TextInput>, 'value'> & {
    value?: number;
    onChangeValue: (v?: number) => void;
};

const numberToString: (n: number | undefined) => string | undefined = (n) =>
    n === undefined ? undefined : n.toString();

const stringToNumber: (s: string | undefined) => number | undefined = (s) => {
    if (s === undefined || s === '') return undefined;
    const n = Number(s);
    return !Number.isNaN(n) ? n : undefined;
};

const NullableNumberTextInput = React.forwardRef<React.ComponentPropsWithoutRef<typeof TextInput>, Props>(
    ({ value, onChangeValue, error, ...props }, ref) => {
        const [displayText, setDisplayText] = useState<string | undefined>(numberToString(value));

        useEffect(() => {
            const s = numberToString(value);
            if (displayText !== s) {
                if (displayText === '' && value === undefined) return;
                if (displayText === '' && value === 0) return;
                if (displayText === s + '.') return;
                setDisplayText(s);
            }
        }, [value]);

        return (
            <TextInput
                ref={ref as any}
                error={stringToNumber(displayText) !== value || error}
                value={displayText || ''}
                keyboardType="numeric"
                onChangeText={(x) => {
                    const val = x.replace(',', '.');
                    setDisplayText(val);

                    if (x === '') {
                        onChangeValue(undefined);
                        return;
                    }

                    const n = Number(val);
                    if (!Number.isNaN(n)) {
                        onChangeValue(n);
                    }
                }}
                {...props}
            />
        );
    },
);

export default NullableNumberTextInput;

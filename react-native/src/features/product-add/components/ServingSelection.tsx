import React from 'react';
import { View } from 'react-native';
import TextToggleButton from 'src/components/TextToggleButton';

type Props = {
    value: string;
    onChange: (v: string) => void;
    servings: string[];
};

export default function ServingSelection({ value, onChange, servings }: Props) {
    return (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            {servings.map((x, i) => (
                <TextToggleButton
                    key={x}
                    label={x}
                    isChecked={value === x}
                    isLeft={i === 0}
                    isRight={i === servings.length - 1}
                    onToggle={() => onChange(x)}
                    style={{ marginLeft: 2, width: 80 }}
                />
            ))}
        </View>
    );
}

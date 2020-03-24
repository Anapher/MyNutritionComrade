import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { TouchableRipple, withTheme, Theme, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Color from 'color';

type Props = {
    isChecked?: boolean;
    label?: string;
    onToggle?: () => void;
    isLeft?: boolean;
    isRight?: boolean;
    theme: Theme;
    style?: StyleProp<ViewStyle>;
};

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    leftRounded: {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    rightRounded: {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
});

function TextToggleButton({ onToggle, isChecked, label, isLeft, isRight, theme, style }: Props) {
    const uncheckedBackground = Color(theme.colors.text)
        .alpha(0.3)
        .string();

    return (
        <TouchableRipple
            borderless
            centered
            style={[
                styles.root,
                isLeft && styles.leftRounded,
                isRight && styles.rightRounded,
                { backgroundColor: isChecked ? theme.colors.primary : uncheckedBackground },
                style,
            ]}
            onPress={isChecked ? undefined : onToggle}
        >
            <Text>{label}</Text>
        </TouchableRipple>
    );
}

export default withTheme(TextToggleButton);

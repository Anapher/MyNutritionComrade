import Color from 'color';
import React, { useRef, useEffect } from 'react';
import { StyleProp, StyleSheet, ViewStyle, View, Animated, Easing } from 'react-native';
import { Text, Theme, TouchableRipple, withTheme } from 'react-native-paper';

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
    const uncheckedBackground = Color(theme.colors.text).alpha(0.3).string();

    const backgroundAnimation = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(backgroundAnimation, {
            toValue: isChecked ? 1 : 0,
            duration: 300,
            easing: Easing.quad,
        }).start();
    }, [isChecked]);

    return (
        <TouchableRipple
            borderless
            centered
            style={[isLeft && styles.leftRounded, isRight && styles.rightRounded, style]}
            onPress={isChecked ? undefined : onToggle}
        >
            <Animated.View
                style={[
                    styles.root,
                    isLeft && styles.leftRounded,
                    isRight && styles.rightRounded,
                    {
                        backgroundColor: backgroundAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [uncheckedBackground, theme.colors.primary],
                        }),
                    },
                ]}
            >
                <Text>{label}</Text>
            </Animated.View>
        </TouchableRipple>
    );
}

export default withTheme(TextToggleButton);

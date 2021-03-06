import Color from 'color';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Theme, TouchableRipple, withTheme, overlay } from 'react-native-paper';

type Props = {
    isChecked?: boolean;
    onToggle?: () => void;
    isLeft?: boolean;
    isRight?: boolean;
    theme: Theme;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    color?: 'primary' | 'accent';
};

function TextToggleButton({ onToggle, isChecked, children, isLeft, isRight, theme, style, color = 'primary' }: Props) {
    const uncheckedBackground = overlay(8, theme.colors.surface) as string;
    const checkedBackground = theme.colors[color];

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
            style={[isLeft && styles.leftRounded, isRight && styles.rightRounded]}
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
                            outputRange: [uncheckedBackground, checkedBackground],
                        }),
                    },
                    style,
                ]}
            >
                {children}
            </Animated.View>
        </TouchableRipple>
    );
}

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

export default withTheme(TextToggleButton);

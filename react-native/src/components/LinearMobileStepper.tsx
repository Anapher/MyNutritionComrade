import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated, Keyboard } from 'react-native';
import { useTheme, TouchableRipple, Surface, overlay } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from 'color';

type ProgressDotsProps = {
    count: number;
    active: number;
    errors: { [key: number]: boolean };
};

function ProgressDots({ count, active, errors }: ProgressDotsProps) {
    const theme = useTheme();

    const activeColor = theme.colors.primary;
    const inactiveColor = overlay(12, theme.colors.surface) as string;

    const activeDotAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(activeDotAnimation, {
            toValue: active * 8 * 2,
            duration: 200,
        }).start();
    }, [active]);

    return (
        <View style={styles.progressDotsRoot}>
            {[...Array(count).keys()].map((x) => (
                <View
                    key={x}
                    style={[
                        styles.progressDot,
                        {
                            backgroundColor: errors[x] ? theme.colors.error : inactiveColor,
                            marginLeft: x > 0 ? 8 : 0,
                        },
                    ]}
                />
            ))}
            <Animated.View
                style={[
                    styles.progressDot,
                    styles.activeDot,
                    { backgroundColor: activeColor, left: activeDotAnimation },
                ]}
            />
        </View>
    );
}

type Props = {
    activeStep: number;
    steps: number;
    onChangeActiveStep: (s: number) => void;
    errors?: { [key: number]: boolean };
    hideOnKeyboardOpening?: boolean;
};

function LinearMobileStepper({ activeStep, steps, onChangeActiveStep, errors = {}, hideOnKeyboardOpening }: Props) {
    const theme = useTheme();
    const foreground = Color(theme.colors.text).alpha(0.5).string();

    const goBack = () => onChangeActiveStep(activeStep - 1);
    const goForward = () => onChangeActiveStep(activeStep + 1);

    const canGoBack = activeStep > 0;
    const canGoForward = activeStep < steps - 1;

    const [isShown, setIsShown] = useState(true);

    useEffect(() => {
        if (hideOnKeyboardOpening) {
            const subscription = Keyboard.addListener('keyboardDidShow', () => setIsShown(false));
            const subscription2 = Keyboard.addListener('keyboardDidHide', () => setIsShown(true));

            return () => {
                subscription.remove();
                subscription2.remove();
            };
        }
    }, [hideOnKeyboardOpening]);

    return (
        <Surface style={[styles.root, !isShown && { display: 'none' }]}>
            <TouchableRipple onPress={canGoBack ? goBack : undefined} style={{ opacity: canGoBack ? 1 : 0.3 }}>
                <View
                    style={[
                        styles.stepperButton,
                        {
                            paddingLeft: 8,
                            paddingRight: 24,
                        },
                    ]}
                >
                    <Icon name="chevron-left" size={24} color={foreground} />
                    <Text style={[styles.stepperButtonText, { color: foreground }]}>back</Text>
                </View>
            </TouchableRipple>

            <ProgressDots active={activeStep} count={steps} errors={errors} />

            <TouchableRipple onPress={canGoForward ? goForward : undefined} style={{ opacity: canGoForward ? 1 : 0.3 }}>
                <View
                    style={[
                        styles.stepperButton,
                        {
                            paddingRight: 8,
                            paddingLeft: 24,
                        },
                    ]}
                >
                    <Text style={[styles.stepperButtonText, { color: foreground }]}>next</Text>
                    <Icon name="chevron-right" size={24} color={foreground} />
                </View>
            </TouchableRipple>
        </Surface>
    );
}

export default LinearMobileStepper;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 1,
    },
    stepperButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    stepperButtonText: {
        textTransform: 'uppercase',
        fontWeight: '700',
    },
    progressDotsRoot: {
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    activeDot: {
        position: 'absolute',
    },
});

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Props = {
    width?: number;
    height?: number;
    edgeLength?: number;
    edgeBorderWidth?: number;
    edgeColor?: string;
    isLoading?: boolean;
};

function Edge({
    edgeHeight,
    edgeWidth,
    color,
    borderWidth,
    position,
}: {
    edgeHeight: number | Animated.Value;
    edgeWidth: number | Animated.Value;
    color: string | Animated.Value;
    borderWidth: number | Animated.Value;
    position: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
}) {
    const edgeBorderStyle = {
        topRight: {
            borderRightWidth: borderWidth,
            borderTopWidth: borderWidth,
            top: 0,
            right: 0,
        },
        topLeft: {
            borderLeftWidth: borderWidth,
            borderTopWidth: borderWidth,
            top: 0,
            left: 0,
        },
        bottomRight: {
            borderRightWidth: borderWidth,
            borderBottomWidth: borderWidth,
            bottom: 0,
            right: 0,
        },
        bottomLeft: {
            borderLeftWidth: borderWidth,
            borderBottomWidth: borderWidth,
            bottom: 0,
            left: 0,
        },
    };

    return (
        <Animated.View
            style={[
                {
                    width: edgeWidth,
                    height: edgeHeight,
                    borderColor: color,
                    position: 'absolute',
                },
                edgeBorderStyle[position],
            ]}
        />
    );
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

function LoadingRect({ width, height, strokeWidth }: { width: number; height: number; strokeWidth: number }) {
    const animation = useRef(new Animated.Value(0)).current;
    const [interpolation, setInterpolation] = useState(
        animation.interpolate({
            inputRange: [0, 1, 2, 3, 4],
            outputRange: [
                `M 0 0 h ${width} v ${height} h -${width} v -${height}`,
                `M ${width} 0 h 0 v ${height} h -${width} v -${height}`,
                `M ${width} ${height} h 0 v 0 h -${width} v -${height}`,
                `M 0 ${height} h 0 v 0 h 0 v -${height}`,
                `M 0 0 h 0 v 0 h 0 v 0`,
            ],
        }),
    );

    const dashWidth = 60;
    const factor = dashWidth / width;

    useEffect(() => {
        Animated.timing(animation, { duration: 1500, toValue: 4 }).start();

        const timer = setTimeout(() => {
            setInterpolation(
                animation.interpolate({
                    inputRange: [factor, 1, 1 + factor, 2, 2 + factor, 3, 3 + factor, 4],
                    outputRange: [
                        `M 0 0 h ${dashWidth} M 0 0 v 0`, // show dash
                        `M ${width - dashWidth} 0 h ${dashWidth} M ${width} 0 v 0`, // move dash to right
                        `M ${width} 0 h 0 M ${width} 0 v ${dashWidth}`, // show vertical dash
                        `M ${width} ${height} h 0 M ${width} ${height - dashWidth} v ${dashWidth}`, // 6 move vertical dash to bottom
                        `M ${width} ${height} h -${dashWidth} M ${width} ${height} v 0`, // 6.factor show h dash
                        `M ${dashWidth} ${height} h -${dashWidth} M 0 ${height} v 0`, // 7 move dash to left
                        `M 0 ${height} h 0 M 0 ${height} v -${dashWidth}`, // 7.factor show vertical dash
                        `M 0 0 h 0 M 0 0 v -${dashWidth}`, // 8 move dash to top
                    ],
                }),
            );

            animation.setValue(0);
            Animated.loop(
                Animated.timing(animation, {
                    toValue: 4,
                    duration: 3000,
                    easing: Easing.linear,
                }),
            ).start();
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Svg width={width} height={height}>
            <AnimatedPath d={interpolation} stroke="white" fill="transparent" strokeWidth={strokeWidth} />
        </Svg>
    );
}

export default function Overlay({
    width = 280,
    height = 230,
    edgeLength = 20,
    edgeBorderWidth = 4,
    edgeColor = '#FFF',
    isLoading = false,
}: Props) {
    const edgeHeight = useRef(new Animated.Value(edgeLength)).current;
    const edgeWidth = useRef(new Animated.Value(edgeLength)).current;

    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

    useEffect(() => {
        Animated.timing(edgeHeight, {
            toValue: isLoading ? height / 2 : edgeLength,
            duration: 600,
            easing: Easing.cubic,
        }).start();
        Animated.timing(edgeWidth, {
            toValue: isLoading ? width / 2 : edgeLength,
            duration: 600,
            easing: Easing.cubic,
        }).start();

        if (isLoading) {
            const timer = setTimeout(() => {
                setShowLoadingIndicator(true);
            }, 600);

            return () => clearTimeout(timer);
        } else {
            setShowLoadingIndicator(false);
        }
    }, [isLoading]);

    return (
        <View style={styles.container}>
            <View style={[styles.maskRow, styles.maskFrame]} />
            <View style={[styles.maskCenter, { height }]}>
                <View style={[styles.maskFrame]} />
                <View style={[styles.maskInner, { width, height }]}>
                    {!showLoadingIndicator && (
                        <>
                            <Edge
                                borderWidth={edgeBorderWidth}
                                color={edgeColor}
                                edgeHeight={edgeHeight}
                                edgeWidth={edgeWidth}
                                position="topLeft"
                            />
                            <Edge
                                borderWidth={edgeBorderWidth}
                                color={edgeColor}
                                edgeHeight={edgeHeight}
                                edgeWidth={edgeWidth}
                                position="topRight"
                            />
                            <Edge
                                borderWidth={edgeBorderWidth}
                                color={edgeColor}
                                edgeHeight={edgeHeight}
                                edgeWidth={edgeWidth}
                                position="bottomRight"
                            />
                            <Edge
                                borderWidth={edgeBorderWidth}
                                color={edgeColor}
                                edgeHeight={edgeHeight}
                                edgeWidth={edgeWidth}
                                position="bottomLeft"
                            />
                        </>
                    )}
                    {showLoadingIndicator && (
                        <LoadingRect width={width} height={height} strokeWidth={edgeBorderWidth * 2} />
                    )}
                </View>
                <View style={[styles.maskFrame]} />
            </View>
            <View style={[styles.maskRow, styles.maskFrame]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        ...StyleSheet.absoluteFillObject,
    },
    maskRow: {
        width: '100%',
    },
    maskFrame: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        flex: 1,
    },
    maskCenter: {
        display: 'flex',
        flexDirection: 'row',
    },
    maskInner: {
        backgroundColor: 'transparent',
    },
});

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop } from 'react-native-svg';
import AnimatedLine from './AnimatedLine';
import { Curve } from './Curve';
import { calculateScale, interpolateGraph, ScalePoint } from './math';
import { Thumb } from './Thumb';
import { Vector2 } from './vector';

type Props = {
    value: number;
    minValue: number;
    maxValue: number;
    step: number;
    scaleSteps: number;
    curveGradientStart: string;
    curveGradientEnd: string;
    curveBackground: string;

    onChange: (value: number) => void;
    width: number;
};

export default function CurvedSlider({
    value,
    onChange,
    width,
    step,
    minValue,
    maxValue,
    scaleSteps,
    curveGradientStart,
    curveGradientEnd,
    curveBackground,
}: Props) {
    const strokeWidth = 20;
    const curveHorizontalMargin = 8;
    const curveBent = 0.7;

    const radius = width * curveBent;
    const height = radius * (1 - curveBent) + strokeWidth;
    const arcWidth = width - curveHorizontalMargin * 2;
    const thumbRadius = 20;

    const [scalePoints, setScalePoints] = useState<ScalePoint[]>([]);

    const thumbPosition = useRef(new Animated.Value(0)).current;
    const [thumbXInterpolation, setThumbXInterpolation] = useState<Animated.InterpolationConfigType | undefined>(
        undefined,
    );
    const [thumbYInterpolation, setThumbYInterpolation] = useState<Animated.InterpolationConfigType | undefined>(
        undefined,
    );

    const scaleAnimation = useRef(new Animated.Value(0));

    // the pan responder cannot use state, so we have to mirror the current state here
    const thumbPanResponderContext = useRef<{
        scalePoints: ScalePoint[];
        arcCenterX: number;
        onChange: (value: number) => void;
        value: number;
        curveHorizontalMargin: number;
        arcWidth: number;
    }>({
        scalePoints: scalePoints,
        arcCenterX: 0,
        onChange,
        value,
        curveHorizontalMargin,
        arcWidth,
    });

    useEffect(() => {
        thumbPanResponderContext.current.onChange = onChange;
        thumbPanResponderContext.current.scalePoints = scalePoints;
        thumbPanResponderContext.current.value = value;
        thumbPanResponderContext.current.arcWidth = arcWidth;
        thumbPanResponderContext.current.curveHorizontalMargin = curveHorizontalMargin;
    }, [scalePoints, onChange, value, curveHorizontalMargin, arcWidth]);

    // calculate the scale points and interpolation
    useEffect(() => {
        let scale = calculateScale(radius, arcWidth, minValue, maxValue, step);
        const scaleExact = calculateScale(radius, arcWidth, minValue, Math.ceil(maxValue / step), 1);

        // i really have no idea why this is necessary, but it seems like calculateScale with larger numbers is unprecise
        scale = scale.map((x) =>
            (x.value - minValue) % step === 0
                ? {
                      ...scaleExact.find((y) => y.value === (x.value - minValue) / step)!,
                      value: x.value,
                  }
                : x,
        );

        // compute interpolation for thumb
        const interpolation = interpolateGraph(scale, radius, arcWidth);
        setThumbXInterpolation({
            inputRange: interpolation.map((x) => x.val),
            outputRange: interpolation.map((x) => x.v.x + curveHorizontalMargin - thumbRadius),
        });
        setThumbYInterpolation({
            inputRange: interpolation.map((x) => x.val),
            outputRange: interpolation.map((x) => height - x.v.y - thumbRadius),
        });

        setScalePoints(
            scale.map<ScalePoint>((x) => ({
                arcPos: new Vector2(x.arcPos.x + curveHorizontalMargin, height - x.arcPos.y),
                perpendicular: x.perpendicular,
                value: x.value,
                relativeValue: x.relativeValue,
            })),
        );

        // animate scale
        scaleAnimation.current.setValue(0);
        Animated.spring(scaleAnimation.current, {
            toValue: 1,
            friction: 3,
        }).start();

        // if the current value cannot be found on the scale, change
        if (scale.findIndex((x) => x.value === value) === -1) {
            onChange(scale[0].value);
        }
    }, [step, minValue, maxValue, width, curveHorizontalMargin]);

    useEffect(() => {
        const scalePoint = scalePoints.find((x) => x.value === value);
        if (scalePoint === undefined) return;

        Animated.timing(thumbPosition, {
            toValue: scalePoint.relativeValue,
            duration: 100,
            easing: Easing.linear,
        }).start();
    }, [value, thumbPosition, minValue, maxValue, radius, arcWidth]);

    const arcRef = useRef<any>(null);

    const thumbPanResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: () => {
                arcRef.current.measure((_x: number, _y: number, _w: number, _h: number, px: number, _py: number) => {
                    thumbPanResponderContext.current.arcCenterX = px;
                });
            },
            onPanResponderMove: (_, { moveX }) => {
                const {
                    scalePoints: scalaPoints,
                    value,
                    onChange,
                    arcCenterX,
                    curveHorizontalMargin,
                    arcWidth,
                } = thumbPanResponderContext.current;

                let relativeValue = (moveX - curveHorizontalMargin - arcCenterX) / arcWidth;

                if (relativeValue < 0) relativeValue = 0;
                else if (relativeValue > 1) relativeValue = 1;

                let newVal: ScalePoint = scalaPoints[scalaPoints.length - 1];
                for (let i = 0; i < scalaPoints.length; i++) {
                    const scalePoint = scalaPoints[i];

                    if (scalePoint.relativeValue >= relativeValue) {
                        if (i === 0) {
                            newVal = scalePoint;
                        } else {
                            const diff = scalePoint.relativeValue - relativeValue;
                            const diffPrevious = relativeValue - scalaPoints[i - 1].relativeValue;

                            if (diff < diffPrevious) {
                                newVal = scalePoint;
                            } else {
                                newVal = scalaPoints[i - 1];
                            }
                        }
                        break;
                    }
                }

                if (value !== newVal.value) onChange(newVal.value);
            },
        }),
    ).current;

    return (
        <View style={{ width, height, position: 'relative' }}>
            <Svg height={width} width={width} ref={arcRef}>
                <Defs>
                    <LinearGradient id="curveStroke">
                        <Stop offset="0%" stopColor={curveGradientStart} />
                        <Stop offset="1" stopColor={curveGradientEnd} />
                    </LinearGradient>
                </Defs>
                <Curve
                    radius={radius}
                    startPos={new Vector2(curveHorizontalMargin, height)}
                    endPos={new Vector2(arcWidth + curveHorizontalMargin, height)}
                    progressColor="url(#curveStroke)"
                    progress={thumbPosition}
                    color={curveBackground}
                    strokeWidth={strokeWidth}
                    height={height}
                    marginLeft={curveHorizontalMargin}
                />
                {scalePoints
                    .filter((x) => (x.value - minValue) % scaleSteps === 0)
                    .map((x, i) => (
                        <AnimatedLine
                            key={`${minValue}/${maxValue}/${step}/${i}`}
                            p1={x.arcPos.add(x.perpendicular.unit().multiply(25))}
                            p2={x.arcPos.add(x.perpendicular.unit().multiply(35))}
                            progress={scaleAnimation.current}
                        />
                    ))}
            </Svg>
            <Thumb
                radius={radius}
                arcWidth={arcWidth}
                marginLeft={curveHorizontalMargin}
                height={height}
                x={thumbXInterpolation && thumbPosition.interpolate(thumbXInterpolation)}
                y={thumbYInterpolation && thumbPosition.interpolate(thumbYInterpolation)}
                thumbRadius={thumbRadius}
                {...thumbPanResponder.panHandlers}
            />
        </View>
    );
}

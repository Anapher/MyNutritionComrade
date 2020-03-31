import React, { useEffect, useRef } from 'react';
import { Line } from 'react-native-svg';
import { Vector2 } from './vector';
import { Animated, StyleSheet } from 'react-native';

type Props = {
    p1: Vector2;
    p2: Vector2;
    progress: Animated.Value;
};
export default function AnimatedLine({ p1, p2, progress }: Props) {
    const ref = useRef<any>(null);

    const updateLine = (n: number) => {
        const current = p2.add(p1.subtract(p2).multiply(n));
        ref.current?.setNativeProps({ x1: current.x, y1: current.y });
    };

    useEffect(() => {
        const listener = progress.addListener((x) => updateLine(x.value));

        return () => progress.removeListener(listener);
    }, [progress, ref.current]);

    useEffect(() => {
        updateLine(1);
    }, [p1.x, p1.y]);

    return <Line ref={ref} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="white" strokeWidth={1} />;
}

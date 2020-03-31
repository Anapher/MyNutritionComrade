import React from 'react';
import { Animated } from 'react-native';

type Props = {
    x?: Animated.AnimatedInterpolation;
    y?: Animated.AnimatedInterpolation;
    arcWidth: number;
    radius: number;
    marginLeft: number;
    height: number;
    thumbRadius: number;
    [x: string]: any;
};

export function Thumb({ x, y, arcWidth, radius, marginLeft, height, thumbRadius, ...props }: Props) {
    return (
        <Animated.View
            {...props}
            style={{
                width: thumbRadius * 2,
                height: thumbRadius * 2,

                position: 'absolute',
                left: x,
                top: y,

                backgroundColor: 'white',
                borderRadius: thumbRadius,

                borderWidth: 0,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 1,
                shadowRadius: 5,
                elevation: 6,
            }}
        />
    );
}

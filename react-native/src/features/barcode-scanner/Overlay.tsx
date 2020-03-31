import React from 'react';
import { StyleSheet, View } from 'react-native';

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

type Props = {
    width?: number;
    height?: number;
    edgeLength?: number;
    edgeBorderWidth?: number;
    edgeColor?: string;
};

function Edge({
    edgeLength,
    color,
    borderWidth,
    position,
}: {
    edgeLength: number;
    color: string;
    borderWidth: number;
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
        <View
            style={[
                { width: edgeLength, height: edgeLength, borderColor: color, position: 'absolute' },
                edgeBorderStyle[position],
            ]}
        />
    );
}

export default function Overlay({
    width = 280,
    height = 230,
    edgeLength = 20,
    edgeBorderWidth = 4,
    edgeColor = '#FFF',
}: Props) {
    return (
        <View style={styles.container}>
            <View style={[styles.maskRow, styles.maskFrame]} />
            <View style={[styles.maskCenter, { height }]}>
                <View style={[styles.maskFrame]} />
                <View style={[styles.maskInner, { width, height }]}>
                    <Edge borderWidth={edgeBorderWidth} color={edgeColor} edgeLength={edgeLength} position="topLeft" />
                    <Edge borderWidth={edgeBorderWidth} color={edgeColor} edgeLength={edgeLength} position="topRight" />
                    <Edge
                        borderWidth={edgeBorderWidth}
                        color={edgeColor}
                        edgeLength={edgeLength}
                        position="bottomRight"
                    />
                    <Edge
                        borderWidth={edgeBorderWidth}
                        color={edgeColor}
                        edgeLength={edgeLength}
                        position="bottomLeft"
                    />
                </View>
                <View style={[styles.maskFrame]} />
            </View>
            <View style={[styles.maskRow, styles.maskFrame]} />
        </View>
    );
}

import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
    buttonContent: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 8,
        paddingTop: 14,
        paddingBottom: 14,
    },
});

type FlatIconButtonProps = {
    icon: string;
    margin: number;
    onPress?: () => void | null;
    longPressInfo?: string;
};

function getToastCallback(text?: string) {
    if (!text) return undefined;
    return () => ToastAndroid.show(text, ToastAndroid.SHORT);
}

export default function FlatIconButton({ icon, margin, onPress, longPressInfo }: FlatIconButtonProps) {
    const theme = useTheme();

    return (
        <TouchableRipple onPress={onPress} borderless onLongPress={getToastCallback(longPressInfo)}>
            <View style={styles.buttonContent}>
                <Icon
                    name={icon}
                    size={20}
                    color={theme.colors.text}
                    style={{ marginRight: margin, marginLeft: margin }}
                />
            </View>
        </TouchableRipple>
    );
}

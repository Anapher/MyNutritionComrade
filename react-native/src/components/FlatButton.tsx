import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
    },
    buttonContent: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 8,
        paddingTop: 12,
        paddingBottom: 12,
    },
});

type FlatButtonProps = {
    icon: string;
    text: string;
    onPress?: () => void | null;
    center?: boolean;
    style?: StyleProp<ViewStyle>;
};

export default function FlatButton({ icon, text, onPress, style, center = false }: FlatButtonProps) {
    const theme = useTheme();
    return (
        <TouchableRipple onPress={onPress} style={style}>
            <View style={[styles.buttonContent, { justifyContent: center ? 'center' : 'flex-start' }]}>
                <Icon name={icon} size={20} color={theme.colors.text} />
                <Text style={{ marginLeft: 8 }}>{text}</Text>
            </View>
        </TouchableRipple>
    );
}

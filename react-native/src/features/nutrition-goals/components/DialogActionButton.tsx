import Color from 'color';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Divider, Subheading, TouchableRipple, useTheme } from 'react-native-paper';

type Props = {
    divider?: boolean;
    onPress: () => void;
    title?: string;
    description?: string;
};

const DialogActionButton = ({ divider, onPress, title, description }: Props) => {
    const theme = useTheme();

    return (
        <View>
            {divider && <Divider style={{ backgroundColor: Color(theme.colors.text).alpha(0.5).string() }} />}
            <TouchableRipple style={styles.dialogItem} onPress={onPress}>
                <View>
                    <Subheading>{title}</Subheading>
                    {description && <Caption>{description}</Caption>}
                </View>
            </TouchableRipple>
        </View>
    );
};

export default DialogActionButton;

const styles = StyleSheet.create({
    dialogItem: {
        paddingVertical: 4,
        paddingHorizontal: 24,
    },
});

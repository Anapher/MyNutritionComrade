import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Color from 'color';

type Props = {
    children?: React.ReactNode;
};

const ReadOnlyTable = ({ children }: Props) => {
    const theme = useTheme();
    return <View style={[styles.tableBorder, { borderColor: theme.colors.text }]}>{children}</View>;
};

type RowProps = {
    label?: string;
    alternate?: boolean;
    showDivider?: boolean;
    children?: React.ReactNode;
};

export function ReadOnlyTableRow({ label, alternate, showDivider, children }: RowProps) {
    const theme = useTheme();
    const rowStyle = alternate
        ? {
              backgroundColor: Color(theme.colors.surface).lighten(1).string(),
          }
        : {
              backgroundColor: theme.colors.surface,
          };

    return (
        <View
            style={[
                styles.row,
                rowStyle,
                showDivider && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.text },
            ]}
        >
            <Text>{label}</Text>
            {children}
        </View>
    );
}

export default ReadOnlyTable;

const styles = StyleSheet.create({
    tableBorder: {
        borderWidth: StyleSheet.hairlineWidth,
    },
    row: {
        padding: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        alignItems: 'center',
    },
});

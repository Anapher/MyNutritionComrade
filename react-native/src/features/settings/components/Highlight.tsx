import React from 'react';
import { useTheme, Text } from 'react-native-paper';

function Highlight({ children }: { children: any }) {
    const theme = useTheme();

    return <Text style={{ color: theme.colors.accent }}>{children}</Text>;
}

export default Highlight;

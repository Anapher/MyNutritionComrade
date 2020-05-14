import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { RequestErrorResponse } from 'src/utils/error-result';
import { ActivityIndicator, Text, useTheme, Button, Subheading } from 'react-native-paper';

type Props = {
    loading: boolean;
    error?: RequestErrorResponse;
    reload?: () => void;
    loadingText?: boolean;
    children?: React.ReactNode;
};

function LoadingPlaceholder({ loading, error, reload, loadingText, children }: Props) {
    const theme = useTheme();

    if (loading) {
        return (
            <View style={[styles.root, styles.centerContentRow]}>
                <ActivityIndicator />
                <Text style={{ marginLeft: 16 }}>{loadingText}</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.root, styles.centerContentColumn]}>
                <Subheading style={{ color: theme.colors.error }}>An error occurred</Subheading>
                {reload && (
                    <Button onPress={reload} style={{ marginTop: 16 }}>
                        Try again
                    </Button>
                )}
            </View>
        );
    }

    return children as ReactElement<any>;
}

export default LoadingPlaceholder;

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
    },
    centerContentRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    centerContentColumn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
});

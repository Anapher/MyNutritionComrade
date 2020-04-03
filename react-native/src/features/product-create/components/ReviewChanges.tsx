import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Color from 'color';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme, Appbar } from 'react-native-paper';
import { RootStackParamList } from 'src/RootNavigator';
import getPatchView from './patch/get-patch-view';
import OperationHeader from './patch/OperationHeader';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'ReviewProductChanges'>;
};

function ReviewChanges({
    route: {
        params: { changes, product, acceptChanges },
    },
    navigation,
}: Props) {
    const changeViews = useMemo(
        () => changes.map((patchOperation) => getPatchView({ currentProduct: product, patchOperation })),
        [product, changes],
    );

    const { colors } = useTheme();
    const headerColor = Color(colors.background).lighten(2).string();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <Appbar.Header>
                    <Appbar.Action
                        icon="close"
                        onPress={() => {
                            navigation.goBack();
                        }}
                    />
                    <Appbar.Content title="Review changes" />
                    <Appbar.Action
                        icon="check"
                        onPress={() => {
                            navigation.goBack();
                            acceptChanges();
                        }}
                    />
                </Appbar.Header>
            ),
        });
    });

    return (
        <ScrollView style={{ backgroundColor: colors.background }}>
            {changeViews.map(({ propertyName, type, view }, i) => (
                <View key={i} style={[styles.card, { backgroundColor: colors.surface }]}>
                    <View style={[styles.cardHeader, { backgroundColor: headerColor }]}>
                        <OperationHeader propertyName={propertyName} type={type} />
                    </View>
                    <View style={styles.cardContent}>{view}</View>
                </View>
            ))}
        </ScrollView>
    );
}

export default ReviewChanges;

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    card: {
        marginBottom: 16,
        paddingBottom: 8,
    },
    cardHeader: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    cardContent: {
        padding: 8,
    },
});

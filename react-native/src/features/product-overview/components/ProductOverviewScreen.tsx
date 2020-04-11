import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { RootStackParamList } from 'src/RootNavigator';
import ProductOverview from './ProductOverview';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Surface } from 'react-native-paper';
import selectLabel from 'src/utils/product-utils';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'ProductOverview'>;
};
function ProductOverviewScreen({
    route: {
        params: { product },
    },
    navigation,
}: Props) {
    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <Appbar.Header>
                    <Appbar.BackAction onPress={navigation.goBack} />
                    <Appbar.Content title={selectLabel(product.label)} />
                </Appbar.Header>
            ),
        });
    });

    return (
        <ScrollView style={styles.root}>
            <Surface style={{ padding: 16 }}>
                <ProductOverview product={product} />
            </Surface>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        height: '100%',
    },
});

export default ProductOverviewScreen;

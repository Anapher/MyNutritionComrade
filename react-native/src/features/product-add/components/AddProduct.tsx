import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { overlay, Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import CurvedSlider from 'src/components/CurvedSlider/CurvedSlider';
import FlatButton from 'src/components/FlatButton';
import { RootStackParamList } from 'src/RootNavigator';
import * as productsApi from 'src/services/api/products';
import selectLabel, { getBaseUnit } from 'src/utils/product-utils';
import * as actions from '../actions';
import AddProductHeader from './AddProductHeader';
import PendingContributionsButton from './PendingContributionsButton';
import ServingInfo from './ServingInfo';
import ServingSelection from './ServingSelection';

const mapStateToProps = (state: RootState) => ({
    slider: state.addProduct.slider,
    pendingContributions: state.addProduct.pendingContributions,
});

const dispatchProps = {
    init: actions.init,
    setVolume: actions.setVolume,
    setServing: actions.setServing,
    requestContributions: actions.loadContributionsAsync.request,
};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps & {
        navigation: StackNavigationProp<RootStackParamList>;
        route: RouteProp<RootStackParamList, 'AddProduct'>;
    };

function AddProduct({
    navigation,
    route: {
        params: { product, onSubmit, volume: startVolume },
    },
    slider,
    pendingContributions,
    init,
    setServing,
    setVolume,
    requestContributions,
}: Props) {
    useEffect(() => {
        init({ product, startVolume });
        requestContributions(product.id);
    }, [product]);

    const theme = useTheme();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <AddProductHeader
                    title={selectLabel(product.label)}
                    navigation={navigation}
                    canSubmit={volume > 0}
                    onSubmit={() => {
                        onSubmit(volume * product.servings[serving]);
                        navigation.goBack();
                    }}
                />
            ),
        });
    });

    if (!slider) return null;
    if (slider.product.id !== product.id) return null;

    const handleChangeProduct = async () => {
        const productDto = await productsApi.getById(product.id);
        navigation.navigate('ChangeProduct', { product: productDto });
    };

    const { volume, selectedServing: serving, curve: curveScale } = slider;
    const curveBackground = overlay(8, theme.colors.surface) as string;

    return (
        <View style={styles.root}>
            <View>
                <View style={styles.servingInfoContainer}>
                    <ServingInfo product={product} volume={volume * product.servings[serving]} />
                </View>
                <View style={styles.servingSelectionContainer}>
                    <ServingSelection product={product} value={serving} onChange={(x) => setServing(x)} />
                </View>
                <View style={styles.sliderContainer}>
                    <CurvedSlider
                        onChange={(x) => setVolume(x)}
                        step={curveScale.step}
                        minValue={0}
                        maxValue={curveScale.max}
                        width={Dimensions.get('window').width - 32}
                        scaleSteps={curveScale.labelStep}
                        curveBackground={curveBackground}
                        curveGradientStart={theme.colors.accent}
                        curveGradientEnd={theme.colors.accent}
                        value={volume}
                    />
                </View>
                <View style={styles.volumeTextContainer}>
                    <Text style={styles.volumeText}>
                        {volume * product.servings[serving]}
                        {getBaseUnit(product)}
                    </Text>
                </View>
            </View>
            <View style={styles.splitView}>
                <FlatButton
                    text="Suggest changes"
                    icon="flag"
                    style={styles.bottomButton}
                    onPress={handleChangeProduct}
                    center
                />
                {pendingContributions !== null && pendingContributions.data.length > 0 && (
                    <PendingContributionsButton
                        pending={pendingContributions.data}
                        onPress={() =>
                            navigation.navigate('VoteProductChanges', {
                                preloaded: pendingContributions,
                                filter: 'pending',
                                product,
                            })
                        }
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        marginTop: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
    },
    splitView: {
        display: 'flex',
        flexDirection: 'row',
    },
    bottomButton: {
        flex: 1,
    },
    servingInfoContainer: {
        marginHorizontal: 16,
    },
    servingSelectionContainer: {
        marginTop: 32,
    },
    sliderContainer: {
        marginTop: 32,
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
    },
    volumeTextContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    volumeText: {
        fontSize: 36,
    },
});

export default connect(mapStateToProps, dispatchProps)(AddProduct);

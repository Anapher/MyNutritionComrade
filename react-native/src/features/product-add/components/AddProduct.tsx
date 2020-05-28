import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect, useState } from 'react';
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
import NumberTextInput from 'src/components/NumberTextInput';

const mapStateToProps = (state: RootState) => ({
    slider: state.addProduct.slider,
    pendingContributions: state.addProduct.pendingContributions,
});

const dispatchProps = {
    init: actions.init,
    setAmount: actions.setAmount,
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
        params: { product, onSubmit, amount: startAmount, servingType: startServingType, disableGoBack },
    },
    slider,
    pendingContributions,
    init,
    setServing,
    setAmount,
    requestContributions,
}: Props) {
    useEffect(() => {
        init({ product, amount: startAmount, servingType: startServingType });
        requestContributions(product.id);
    }, [product]);

    const [isInputValid, setIsInputValid] = useState(true);

    const theme = useTheme();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <AddProductHeader
                    title={selectLabel(product.label)}
                    navigation={navigation}
                    canSubmit={isInputValid && slider !== null && slider.amount > 0}
                    onSubmit={() => {
                        onSubmit(slider!.amount, slider!.servingType);
                        if (!disableGoBack) navigation.goBack();
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

    const { amount, servingType, curve: curveScale } = slider;
    const curveBackground = overlay(8, theme.colors.surface) as string;

    return (
        <View style={styles.root}>
            <View>
                <View style={styles.servingInfoContainer}>
                    <ServingInfo product={product} volume={amount * product.servings[servingType]} />
                </View>
                <View style={styles.servingSelectionContainer}>
                    <ServingSelection product={product} value={servingType} onChange={(x) => setServing(x)} />
                </View>
                <View style={styles.sliderContainer}>
                    <CurvedSlider
                        onChange={(x) => setAmount(x)}
                        step={curveScale.step}
                        minValue={0}
                        maxValue={curveScale.max}
                        width={Dimensions.get('window').width - 32}
                        scaleSteps={curveScale.labelStep}
                        curveBackground={curveBackground}
                        curveGradientStart={theme.colors.accent}
                        curveGradientEnd={theme.colors.accent}
                        value={amount}
                    />
                </View>
                <View style={styles.volumeContainer}>
                    <NumberTextInput
                        style={styles.volumeText}
                        value={amount}
                        onChangeValue={(x) => setAmount(x)}
                        onChangeState={(x) => setIsInputValid(x)}
                    />
                    <View
                        style={[
                            styles.row,
                            { display: servingType === getBaseUnit(product) ? 'none' : 'flex', opacity: 0.6 },
                        ]}
                    >
                        <Text>{amount * product.servings[servingType]}g</Text>
                    </View>
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
    row: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    volumeContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    volumeText: {
        fontSize: 36,
        borderBottomColor: 'white',
    },
});

export default connect(mapStateToProps, dispatchProps)(AddProduct);

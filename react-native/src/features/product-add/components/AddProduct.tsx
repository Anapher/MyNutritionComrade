import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Color from 'color';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import CurvedSlider from 'src/components/CurvedSlider/CurvedSlider';
import FlatButton from 'src/components/FlatButton';
import { TagLiquid } from 'src/consts';
import { RootStackParamList } from 'src/RootNavigator';
import * as productsApi from 'src/services/api/products';
import selectLabel from 'src/utils/product-utils';
import * as actions from '../actions';
import AddProductHeader from './AddProductHeader';
import ServingInfo from './ServingInfo';
import ServingSelection from './ServingSelection';
import { ProductContributionDto } from 'Models';

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

    const { volume, selectedServing: serving, curve: curveScale } = slider;
    const curveBackground = Color(theme.colors.text).alpha(0.3).string();

    return (
        <View
            style={{
                marginTop: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
            }}
        >
            <View>
                <View style={{ marginHorizontal: 16 }}>
                    <ServingInfo product={product} volume={volume * product.servings[serving]} />
                </View>
                <View style={{ marginTop: 32 }}>
                    <ServingSelection product={product} value={serving} onChange={(x) => setServing(x)} />
                </View>
                <View style={{ marginTop: 16, marginHorizontal: 16 }}>
                    <CurvedSlider
                        onChange={(x) => setVolume(x)}
                        step={curveScale.step}
                        minValue={0}
                        maxValue={curveScale.max}
                        width={Dimensions.get('window').width - 32}
                        scaleSteps={curveScale.labelStep}
                        curveBackground={curveBackground}
                        curveGradientStart="#e74c3c"
                        curveGradientEnd="#e74c3c"
                        value={volume}
                    />
                </View>
                <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                    <Text style={{ fontSize: 36 }}>
                        {volume * product.servings[serving]}
                        {product.tags.includes(TagLiquid) ? 'ml' : 'g'}
                    </Text>
                </View>
            </View>
            <View style={styles.splitView}>
                <FlatButton
                    text="Suggest changes"
                    icon="flag"
                    style={styles.bottomButton}
                    onPress={
                        (async () => {
                            const productDto = await productsApi.getById(product.id);
                            navigation.navigate('ChangeProduct', { product: productDto });
                        }) as any
                    }
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

function PendingContributionsButton({ pending, onPress }: { pending: ProductContributionDto[]; onPress: () => void }) {
    const voteChanges = pending.filter((x) => !x.vote);

    let text = '';
    if (voteChanges.length > 0) {
        text = `${voteChanges.length} change${voteChanges.length > 1 ? 's' : ''} to vote`;
    } else {
        text = `${pending.length} pending change${pending.length > 1 ? 's' : ''}`;
    }

    return (
        <FlatButton
            style={[styles.bottomButton, voteChanges.length > 0 && styles.highlightedButton]}
            text={text}
            icon="poll-box"
            onPress={onPress}
            center
        />
    );
}

const styles = StyleSheet.create({
    splitView: {
        display: 'flex',
        flexDirection: 'row',
    },
    bottomButton: {
        flex: 1,
    },
    highlightedButton: {
        backgroundColor: Color('#e67e22').alpha(0.3).string(),
    },
});

export default connect(mapStateToProps, dispatchProps)(AddProduct);

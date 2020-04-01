import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Color from 'color';
import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import CurvedSlider from 'src/components/CurvedSlider/CurvedSlider';
import { RootStackParamList } from 'src/RootNavigator';
import { selectScale } from '../utils';
import AddProductHeader from './AddProductHeader';
import ServingInfo from './ServingInfo';
import ServingSelection from './ServingSelection';
import { TagLiquid } from 'src/consts';
import selectLabel from 'src/utils/label-selector';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'AddProduct'>;
};

function AddProduct({
    navigation,
    route: {
        params: { product, onSubmit, volume: startVolume },
    },
}: Props) {
    const [volume, setVolume] = useState(0);
    const [serving, setServing] = useState(product.defaultServing);
    const loadState = useRef({ isLoaded: false });

    const [curveScale, setCurveScale] = useState(() =>
        selectScale(serving, product.servings[serving], product.nutritionInformation),
    );

    const theme = useTheme();
    const curveBackground = Color(theme.colors.text).alpha(0.3).string();

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

    useEffect(() => {
        if (!loadState.current.isLoaded) {
            loadState.current.isLoaded = true;

            if (startVolume) {
                setVolume(startVolume - (startVolume % curveScale.step));
                return;
            }
        }

        setVolume(curveScale.labelStep);
    }, [curveScale]);

    return (
        <View style={{ marginTop: 16 }}>
            <View style={{ marginHorizontal: 16 }}>
                <ServingInfo product={product} volume={volume * product.servings[serving]} />
            </View>
            <View style={{ marginTop: 32 }}>
                <ServingSelection
                    product={product}
                    value={serving}
                    onChange={(x) => {
                        setServing(x);

                        const scale = selectScale(x, product.servings[x], product.nutritionInformation);
                        setCurveScale(scale);
                    }}
                />
            </View>
            <View style={{ marginTop: 16, marginHorizontal: 16 }}>
                <CurvedSlider
                    value={volume}
                    onChange={(x) => setVolume(x)}
                    step={curveScale.step}
                    minValue={0}
                    maxValue={curveScale.max}
                    width={Dimensions.get('window').width - 32}
                    scaleSteps={curveScale.labelStep}
                    curveBackground={curveBackground}
                    curveGradientStart="#e74c3c"
                    curveGradientEnd="#e74c3c"
                />
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                <Text style={{ fontSize: 36 }}>
                    {volume * product.servings[serving]}
                    {product.tags.includes(TagLiquid) ? 'ml' : 'g'}
                </Text>
            </View>
        </View>
    );
}

export default AddProduct;

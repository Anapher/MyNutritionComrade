import { RouteProp, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BarCodeScannedCallback, BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { RootStackParamList } from '../../RootNavigator';
import Overlay from './Overlay';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'ScanBarcode'>;
};

function BarcodeScanner({
    navigation,
    route: {
        params: { onBarcodeScanned },
    },
}: Props) {
    const isFocused = useIsFocused();
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            if (status !== 'granted') {
                navigation.goBack();
            }
            setHasPermission(status === 'granted');
        })();
    }, []);

    const [isLoading, setIsLoading] = useState(false);

    const handleBarCodeScanned: BarCodeScannedCallback = async (result) => {
        const promise = onBarcodeScanned(result, navigation);
        setIsLoading(true);
        if ((await promise) !== true) {
            navigation.goBack();
        }
    };

    const [torch, setTorch] = useState(false);

    if (!hasPermission) {
        return <Text>Requesting for camera permission</Text>;
    }

    return (
        <Camera
            onBarCodeScanned={(!isFocused || isLoading ? undefined : handleBarCodeScanned) as any}
            barCodeScannerSettings={{ barCodeTypes: ['upc_a', 'upc_e', 'upc_ean', 'ean13', 'ean8'] }}
            style={StyleSheet.absoluteFill}
            ratio="16:9"
            useCamera2Api
            flashMode={torch ? 'torch' : 'off'}
        >
            <View style={StyleSheet.absoluteFill}>
                <View style={styles.statusBar}>
                    <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                    <IconButton icon={torch ? 'flash-off' : 'flash'} onPress={() => setTorch(!torch)} />
                </View>
                <Overlay isLoading={isLoading} />
            </View>
        </Camera>
    );
}

const styles = StyleSheet.create({
    statusBar: {
        position: 'absolute',
        top: StatusBar.currentHeight,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 100,
    },
});

export default BarcodeScanner;

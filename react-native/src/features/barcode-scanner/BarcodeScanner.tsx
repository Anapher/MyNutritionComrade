import { RouteProp, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BarCodeScannedCallback, BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { RootStackParamList } from '../../RootNavigator';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'ScanBarcode'>;
};

function BarcodeScanner({ navigation, route }: Props) {
    const isFocused = useIsFocused();
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned: BarCodeScannedCallback = (result) => {
        route.params.onBarcodeScanned(result);
        navigation.goBack();
    };

    const [torch, setTorch] = useState(false);

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
            }}
        >
            <Camera
                onBarCodeScanned={(!isFocused ? undefined : handleBarCodeScanned) as any}
                barCodeScannerSettings={{ barCodeTypes: ['upc_a', 'upc_e', 'upc_ean', 'ean13', 'ean8'] }}
                style={StyleSheet.absoluteFill}
                ratio="16:9"
                useCamera2Api
                flashMode={torch ? 'torch' : 'off'}
            >
                <View>
                    <View
                        style={{
                            marginTop: StatusBar.currentHeight,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
                        <IconButton icon={torch ? 'flash-off' : 'flash'} onPress={() => setTorch(!torch)} />
                    </View>
                </View>
            </Camera>
        </View>
    );
}

export default BarcodeScanner;

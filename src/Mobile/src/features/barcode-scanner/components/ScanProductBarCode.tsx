import { RouteProp, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BarCodeScanningResult, Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { RootNavigatorParamList } from 'src/RootNavigator';
import Overlay from './Overlay';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   route: RouteProp<RootNavigatorParamList, 'ScanBarcode'>;
};

function ScanProductBarCode({
   navigation,
   route: {
      params: { onBarcodeScannedAction },
   },
}: Props) {
   const isFocused = useIsFocused();
   const [hasPermission, setHasPermission] = useState(false);
   const dispatch = useDispatch();

   useEffect(() => {
      (async () => {
         const { status } = await Camera.requestPermissionsAsync();
         if (status !== 'granted') {
            navigation.goBack();
         }
         setHasPermission(status === 'granted');
      })();
   }, []);

   const [isLoading, setIsLoading] = useState(false);

   const handleBarCodeScanned = (result: BarCodeScanningResult) => {
      setIsLoading(true);

      setTimeout(() => {
         dispatch({ ...onBarcodeScannedAction, payload: { ...onBarcodeScannedAction.payload, result } });
      }, 600);
   };

   const [torch, setTorch] = useState(false);

   if (!hasPermission) {
      return <Text>Requesting for camera permission</Text>;
   }

   return (
      <Camera
         onBarCodeScanned={(!isFocused || isLoading ? undefined : handleBarCodeScanned) as any}
         style={StyleSheet.absoluteFill}
         useCamera2Api
         flashMode={torch ? 'torch' : 'off'}
      >
         <View style={StyleSheet.absoluteFill}>
            <SafeAreaView style={styles.statusBar} mode="margin">
               <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
               <IconButton icon={torch ? 'flash-off' : 'flash'} onPress={() => setTorch(!torch)} />
            </SafeAreaView>

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

export default ScanProductBarCode;

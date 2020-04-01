import React from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/RootNavigator';
import { FormikProps } from 'formik';
import { ProductInfo } from 'Models';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    formik: FormikProps<ProductInfo>;
};

export default function BarCodeField({ navigation, formik }: Props) {
    const { values, handleChange, setFieldValue } = formik;

    const handleScanBarcode = () => {
        navigation.push('ScanBarcode', { onBarcodeScanned: async ({ data }) => setFieldValue('code', data) });
    };

    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
            <TextInput
                style={{ flex: 1, marginRight: 16, textTransform: 'uppercase' }}
                mode="flat"
                label="Barcode"
                dense
                autoCompleteType="off"
                keyboardType="visible-password"
                autoCapitalize="characters"
                value={values.code}
                onChangeText={handleChange('code')}
            />
            <Button icon="camera" mode="outlined" onPress={handleScanBarcode}>
                Scan
            </Button>
        </View>
    );
}

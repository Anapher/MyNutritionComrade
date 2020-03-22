import { StackNavigationProp } from '@react-navigation/stack';
import { FormikProps } from 'formik';
import { ProductInfo } from 'Models';
import React from 'react';
import { View } from 'react-native';
import { Button, TextInput, Theme, withTheme } from 'react-native-paper';
import { RootStackParamList } from 'src/RootNavigator';

type Props = {
    formik: FormikProps<ProductInfo>;
    theme: Theme;
    navigation: StackNavigationProp<RootStackParamList>;
};

function ProductLabel({ formik, navigation }: Props) {
    const { values, handleChange, setFieldValue } = formik;

    const handleScanBarcode = () => {
        navigation.push('ScanBarcode', { onBarcodeScanned: ({ data }) => setFieldValue('code', data) });
    };

    return (
        <View style={{ margin: 8 }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                <TextInput
                    style={{ flex: 1, marginRight: 16, textTransform: 'uppercase' }}
                    mode="flat"
                    label="Barcode"
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
        </View>
    );
}

export default withTheme(ProductLabel);

import { StackNavigationProp } from '@react-navigation/stack';
import { FormikProps } from 'formik';
import { ProductInfo, ProductProperties } from 'Models';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Caption, TextInput, useTheme } from 'react-native-paper';
import { RootStackParamList } from 'src/RootNavigator';
import * as productsApi from 'src/services/api/products';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    formik: FormikProps<ProductProperties>;
    duplicationCheck: boolean;
};

type BarcodeCheckResult = {
    barcode: string;
    product?: ProductInfo;
};

function BarCodeField({ navigation, formik, duplicationCheck }: Props) {
    const { values, setFieldValue } = formik;
    const [checkResults, setCheckResults] = useState<BarcodeCheckResult[]>([]);

    const handleCheckBarcode = async (s: string) => {
        if (!duplicationCheck) return;
        if (checkResults.find((x) => x.barcode === s)) return;

        try {
            const product = await productsApi.searchByBarcode(s);
            setCheckResults((x) => [...x, { barcode: s, product }]);
        } catch (error) {
            // ignore
        }
    };

    const handleScanBarcode = () => {
        navigation.push('ScanBarcode', {
            onBarcodeScanned: async ({ data }) => {
                setFieldValue('code', data);
                handleCheckBarcode(data);
            },
        });
    };

    const isCodeDuplicate =
        duplicationCheck && values.code && checkResults.find((x) => x.barcode === values.code)?.product;

    const theme = useTheme();
    return (
        <View>
            <View style={styles.textFieldRow}>
                <TextInput
                    style={styles.textInput}
                    mode="flat"
                    label="Barcode"
                    dense
                    autoCompleteType="off"
                    keyboardType="visible-password"
                    autoCapitalize="characters"
                    value={values.code || ''}
                    onChangeText={(x) => setFieldValue('code', x || null)}
                    onEndEditing={({ nativeEvent: { text } }) => handleCheckBarcode(text)}
                />

                <Button icon="camera" mode="outlined" onPress={handleScanBarcode}>
                    Scan
                </Button>
            </View>
            {isCodeDuplicate && (
                <View style={styles.errorView}>
                    <Caption style={{ color: theme.colors.error }}>
                        A product with an equal barcode was already found in our database. There cannot be two products
                        with the same barcode. Do you want to edit the existing entry?
                    </Caption>
                    <Button
                        mode="outlined"
                        style={styles.errorButton}
                        color={theme.colors.error}
                        onPress={() =>
                            navigation.replace('ChangeProduct', {
                                product: checkResults.find((x) => x.barcode === values.code)?.product!,
                            })
                        }
                    >
                        Edit exiting product
                    </Button>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    textFieldRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    textInput: {
        flex: 1,
        marginRight: 16,
        textTransform: 'uppercase',
    },
    errorView: {
        margin: 8,
    },
    errorButton: {
        marginTop: 8,
    },
});

export default BarCodeField;

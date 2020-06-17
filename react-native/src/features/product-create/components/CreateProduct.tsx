import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FormikHelpers } from 'formik';
import { ProductProperties } from 'Models';
import React, { useState } from 'react';
import { ToastAndroid } from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import useAsyncFunction from 'src/hooks/use-async-function';
import { RootStackParamList } from 'src/RootNavigator';
import * as productsApi from 'src/services/api/products';
import { isRestError, isServerUnavailable, RequestErrorResponse, toString } from 'src/utils/error-result';
import * as actions from '../actions';
import { emptyProductInfo } from '../data';
import ProductEditor from './ProductEditor';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'CreateProduct'>;
};

function CreateProduct({
    route: {
        params: { initialValues },
    },
    navigation,
}: Props) {
    const createAction = useAsyncFunction(
        actions.createAsync.request,
        actions.createAsync.success,
        actions.createAsync.failure,
    )!;

    const [duplicateBarcode, setDuplicateBarcode] = useState<string | undefined>();
    const [dialogIsLoading, setDialogIsLoading] = useState(false);

    const handleEditDuplicateEntry = async () => {
        const barcode = duplicateBarcode!;
        setDialogIsLoading(true);

        try {
            try {
                const product = await productsApi.searchByBarcode(barcode);
                if (product === undefined) {
                    ToastAndroid.show(
                        'The product with the barcode was not found. Please try again to create the product.',
                        3000,
                    );
                    return;
                }
                navigation.replace('ChangeProduct', { product });
            } catch (_error) {
                const error: RequestErrorResponse = _error;
                ToastAndroid.show(toString(error), 3000);
                return;
            }
        } finally {
            setDialogIsLoading(false);
            setDuplicateBarcode(undefined);
        }
    };

    const createProduct = async (values: ProductProperties, formikActions: FormikHelpers<ProductProperties>) => {
        const { setSubmitting } = formikActions;

        try {
            await createAction(values);
            navigation.goBack();
            ToastAndroid.show('The product was created successfully.', 3000);
        } catch (_error) {
            const error: RequestErrorResponse = _error;

            if (isServerUnavailable(error)) {
                ToastAndroid.show('Please check your internet connection.', 3000);
                return;
            }

            if (isRestError(error.response)) {
                switch (error.response.code) {
                    case 1604:
                        setDuplicateBarcode(values.code!);
                        return;
                }

                ToastAndroid.show(error.response.message, 3000);
                return;
            }

            ToastAndroid.show('The server responded with an error: ' + toString(error), 3000);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <ProductEditor
                loadingTitle="Creating product..."
                title="Create Product"
                titleIcon="check"
                initialValue={{ ...emptyProductInfo, ...initialValues }}
                onSubmit={createProduct}
                navigation={navigation}
                duplicationCheck={true}
            />
            <Portal>
                <Dialog visible={!!duplicateBarcode} onDismiss={() => setDuplicateBarcode(undefined)}>
                    <Dialog.Content>
                        <Paragraph>
                            A product with an equal barcode was already found in our database. There cannot be two
                            products with the same barcode. Do you want to edit the existing entry?
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDuplicateBarcode(undefined)}>Cancel</Button>
                        <Button onPress={handleEditDuplicateEntry} loading={dialogIsLoading} disabled={dialogIsLoading}>
                            Edit Product
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}

export default CreateProduct;

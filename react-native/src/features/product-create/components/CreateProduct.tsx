import React from 'react';
import { StyleSheet, Text, View, ToastAndroid } from 'react-native';
import { RestError } from 'src/utils/error-result';
import { ProductInfo } from 'Models';
import { FormikHelpers } from 'formik';
import ProductEditor from './ProductEditor';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/RootNavigator';
import { RouteProp } from '@react-navigation/native';
import { emptyProductInfo } from '../data';
import useAsyncFunction from 'src/hooks/use-async-function';
import * as actions from '../actions';
import { AxiosError } from 'axios';

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

    const createProduct = async (values: ProductInfo, formikActions: FormikHelpers<ProductInfo>) => {
        const { setSubmitting, setErrors } = formikActions;

        try {
            await createAction(values);
            navigation.goBack();
            ToastAndroid.show('The product was created successfully.', 3000);
        } catch (error) {
            const axiosError: AxiosError = error;

            if (axiosError?.response === undefined) {
                ToastAndroid.show('Connection failed.', 3000);
                return;
            }

            if (typeof axiosError.response === 'string') {
                ToastAndroid.show(`Request failed: ${axiosError.response}`, 3000);
                return;
            }

            const restErrors = axiosError.response.data as RestError[];
            for (const error of restErrors) {
                ToastAndroid.show(error.message, 3000);
                if (error.fields) {
                    setErrors(error.fields);
                }
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ProductEditor
            loadingTitle="Creating product..."
            title="Create Product"
            titleIcon="check"
            initialValue={{ ...emptyProductInfo, ...initialValues }}
            onSubmit={createProduct}
            navigation={navigation}
        />
    );
}

export default CreateProduct;

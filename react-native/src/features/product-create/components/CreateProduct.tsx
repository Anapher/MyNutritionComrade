import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { ProductProperties } from 'Models';
import React from 'react';
import { ToastAndroid } from 'react-native';
import useAsyncFunction from 'src/hooks/use-async-function';
import { RootStackParamList } from 'src/RootNavigator';
import { RestError } from 'src/utils/error-result';
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

    const createProduct = async (values: ProductProperties, formikActions: FormikHelpers<ProductProperties>) => {
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

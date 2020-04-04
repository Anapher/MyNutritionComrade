import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FormikHelpers } from 'formik';
import itiriri from 'itiriri';
import { ProductInfo } from 'Models';
import React, { useState } from 'react';
import { ToastAndroid } from 'react-native';
import useAsyncFunction from 'src/hooks/use-async-function';
import { RootStackParamList } from 'src/RootNavigator';
import * as productsApi from 'src/services/api/products';
import * as actions from '../actions';
import { createPatch, reducePatch } from '../utils';
import ProductEditor from './ProductEditor';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'ChangeProduct'>;
};

const mapToProductInfo: (p: ProductInfo) => ProductInfo = (p: ProductInfo) => ({
    code: p.code,
    defaultServing: p.defaultServing,
    label: p.label,
    nutritionalInfo: p.nutritionalInfo,
    servings: p.servings,
    tags: p.tags,
});

function ChangeProduct({
    navigation,
    route: {
        params: { product },
    },
}: Props) {
    const [loadingText, setLoadingText] = useState('Generate changes...');

    const updateAction = useAsyncFunction(
        actions.updateAsync.request,
        actions.updateAsync.success,
        actions.updateAsync.failure,
    )!;

    const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);

    const changeProduct = async (values: ProductInfo, formikActions: FormikHelpers<ProductInfo>) => {
        const currentProduct = await productsApi.getById(product.id);
        const productInfo = mapToProductInfo(currentProduct);

        const differences = createPatch(productInfo, values);
        const changesets = itiriri(reducePatch(differences)).toArray();
        if (changesets.length === 0) {
            navigation.goBack();
            ToastAndroid.show('No changes were found.', 3000);
            return;
        }

        let promiseResolve: (b: boolean) => void;
        const reviewPromise = new Promise<boolean>((resolve) => (promiseResolve = resolve));
        const unsubscribe = navigation.addListener('focus', () => promiseResolve(false));

        setShowLoadingIndicator(false);
        navigation.navigate('ReviewProductChanges', {
            changes: changesets,
            product: currentProduct,
            acceptChanges: () => promiseResolve(true),
        });

        const result = await reviewPromise;
        unsubscribe();

        if (!result) return;
        setShowLoadingIndicator(true);

        setLoadingText('Uploading changes...');
        await updateAction({ productId: product.id, patch: changesets });
    };

    return (
        <ProductEditor
            loadingTitle={loadingText}
            title="Change product"
            titleIcon="sync"
            disableLoadingIndicator={!showLoadingIndicator}
            initialValue={mapToProductInfo(product)}
            onSubmit={changeProduct}
            navigation={navigation}
        />
    );
}

export default ChangeProduct;

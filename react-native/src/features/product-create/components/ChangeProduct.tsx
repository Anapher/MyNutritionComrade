import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import itiriri from 'itiriri';
import _ from 'lodash';
import React, { useState } from 'react';
import { ToastAndroid } from 'react-native';
import useAsyncFunction from 'src/hooks/use-async-function';
import { RootStackParamList } from 'src/RootNavigator';
import * as productsApi from 'src/services/api/products';
import { RequestErrorResponse, toString } from 'src/utils/error-result';
import * as actions from '../actions';
import { createPatch, reducePatch } from '../utils';
import ProductEditor from './ProductEditor';
import { ProductProperties } from 'Models';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'ChangeProduct'>;
};

const mapToProductInfo: (p: ProductProperties) => ProductProperties = (p: ProductProperties) => ({
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

    const changeProduct = async (values: ProductProperties) => {
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
        try {
            await updateAction({ productId: product.id, patch: _.flatMap(changesets) });
        } catch (error) {
            const restError: RequestErrorResponse = error;
            ToastAndroid.show(toString(restError), 3000);
            return;
        }

        navigation.goBack();
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
            duplicationCheck={false}
        />
    );
}

export default ChangeProduct;

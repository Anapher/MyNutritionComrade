import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import React, { useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import config from 'src/config';
import { updateRepository } from 'src/features/repo-manager/reducer';
import useSafeRequest from 'src/hooks/useSafeRequest';
import { RootNavigatorParamList } from 'src/RootNavigator';
import api from 'src/services/api';
import { ProductProperties } from 'src/types';
import { applyAxiosError } from 'src/utils/error-utils';
import schema from '../validation';
import ProductEditor from './ProductEditor/ProductEditor';
import { compare } from 'fast-json-patch';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   route: RouteProp<RootNavigatorParamList, 'ChangeProduct'>;
};

export default function ChangeProduct({
   navigation,
   route: {
      params: { product },
   },
}: Props) {
   const { t } = useTranslation();
   const { makeSafeRequest } = useSafeRequest();
   const [requestError, setRequestError] = useState<string | undefined>();

   const form = useForm<ProductProperties>({
      defaultValues: product,
      resolver: zodResolver(schema),
   });

   const {
      handleSubmit,
      formState: { isSubmitting },
      setError,
   } = form;

   const handleCreate = async (data: ProductProperties) => {
      try {
         const operations = compare(product, data);
         const operationGroups = await makeSafeRequest(
            async () => await api.product.previewPatchProduct(product.id, operations),
            false,
         );

         navigation.push('ReviewProductChanges', { product, changes: operationGroups });
      } catch (error) {
         const domainError = applyAxiosError(error, setRequestError, setError);
         if (domainError) {
            if (domainError.code === 'ProductCodeAlreadyExists') {
               setError('code', { message: t('errors.ProductCodeAlreadyExists') });
               setRequestError(undefined);
            }
         }
      }
   };

   useLayoutEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <Button title={t('common:next')} disabled={isSubmitting} onPress={handleSubmit(handleCreate)} />
         ),
      });
   }, [handleSubmit]);

   return (
      <>
         {requestError && <Text>{requestError}</Text>}
         <ProductEditor form={form} />
      </>
   );
}

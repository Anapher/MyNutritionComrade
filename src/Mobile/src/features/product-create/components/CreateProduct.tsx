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
import { emptyProduct } from '../data';
import schema from '../validation';
import ProductEditor from './ProductEditor/ProductEditor';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   route: RouteProp<RootNavigatorParamList, 'CreateProduct'>;
};

export default function CreateProduct({
   navigation,
   route: {
      params: { initialValue },
   },
}: Props) {
   const dispatch = useDispatch();
   const { t } = useTranslation();
   const { makeSafeRequest } = useSafeRequest();
   const [requestError, setRequestError] = useState<string | undefined>();

   const form = useForm<ProductProperties>({
      defaultValues: {
         ...emptyProduct,
         nutritionalInfo: { volume: 100 },
         ...initialValue,
      },
      resolver: zodResolver(schema),
   });

   const {
      handleSubmit,
      formState: { isSubmitting, errors },
      setError,
   } = form;

   const handleCreate = async (data: ProductProperties) => {
      try {
         await makeSafeRequest(() => api.product.create(data), true);
         dispatch(updateRepository(config.writeRepository.key));
         navigation.pop(1);
      } catch (error) {
         const domainError = applyAxiosError(error, setRequestError, setError);
         console.log(domainError);

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
         headerRight: () => <Button title={t('create')} disabled={isSubmitting} onPress={handleSubmit(handleCreate)} />,
      });
   }, [handleSubmit]);

   return (
      <>
         {requestError && <Text>{requestError}</Text>}
         <ProductEditor form={form} />
      </>
   );
}

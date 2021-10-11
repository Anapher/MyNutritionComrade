import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import React, { useEffect, useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native';
import { useDispatch } from 'react-redux';
import useSafeRequest from 'src/hooks/useSafeRequest';
import { RootNavigatorParamList } from 'src/RootNavigator';
import api from 'src/services/api';
import { ProductProperties } from 'src/types';
import { tryExtractDomainError } from 'src/utils/error-utils';
import { emptyProduct } from '../data';
import { initialize } from '../reducer';
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

   useEffect(() => {
      dispatch(initialize({ mode: 'create' }));
   }, []);

   const form = useForm<ProductProperties>({
      defaultValues: {
         ...emptyProduct,
         // nutritionalInfo: { volume: 100 },
         ...{ nutritionalInfo: emptyProduct.nutritionalInfo, label: { de: { value: 'Haferflocken' } } }, // for testing
         ...initialValue,
      },
      resolver: zodResolver(schema),
   });

   const handleCreate = async (data: ProductProperties) => {
      try {
         console.log(data);

         await makeSafeRequest(async () => await api.product.create(data), true);
         navigation.pop(1);
      } catch (error) {
         console.log(error);
      }
   };

   useLayoutEffect(() => {
      navigation.setOptions({
         headerRight: () => <Button title={t('create')} onPress={form.handleSubmit(handleCreate)} />,
      });
   }, [form]);

   return <ProductEditor form={form} />;
}

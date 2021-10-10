import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import React, { useEffect, useLayoutEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ProductProperties } from 'src/types';
import ProductEditor from './ProductEditor/ProductEditor';
import { initialize } from '../reducer';
import { emptyProduct } from '../data';
import { Button } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import schema from '../validation';
import { useTranslation } from 'react-i18next';

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

   const handleCreate = (data: ProductProperties) => {
      navigation.push('Login', {});
   };

   useLayoutEffect(() => {
      navigation.setOptions({
         headerRight: () => <Button title={t('create')} onPress={form.handleSubmit(handleCreate)} />,
      });
   }, [form]);

   return <ProductEditor form={form} />;
}

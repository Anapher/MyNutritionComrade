import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ProductProperties } from 'src/types';
import ProductEditor from './ProductEditor/ProductEditor';
import { initialize } from '../reducer';
import { emptyProduct } from '../data';

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

   useEffect(() => {
      dispatch(initialize({ mode: 'create' }));
   }, []);

   const form = useForm<ProductProperties>({ defaultValues: { ...emptyProduct, ...initialValue } });

   return <ProductEditor form={form} />;
}

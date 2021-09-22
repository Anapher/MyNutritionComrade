import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import cuid from 'cuid';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ProductProperties } from 'src/types';
import ProductEditor from './components/ProductEditor/ProductEditor';
import { initialize } from './reducer';

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

   const form = useForm<ProductProperties>({ defaultValues: initialValue });

   return <ProductEditor form={form} />;
}

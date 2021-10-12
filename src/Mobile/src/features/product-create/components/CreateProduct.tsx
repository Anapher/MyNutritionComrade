import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import config from 'src/config';
import { updateRepository } from 'src/features/repo-manager/actions';
import useSafeRequest from 'src/hooks/useSafeRequest';
import { RootNavigatorParamList } from 'src/RootNavigator';
import api from 'src/services/api';
import { ProductProperties } from 'src/types';
import { applyAxiosError } from 'src/utils/error-utils';
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
   const [requestError, setRequestError] = useState<string | undefined>();

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
         await makeSafeRequest(async () => await api.product.create(data), true);
         dispatch(updateRepository(config.writeRepository.key));
         navigation.pop(1);
      } catch (error) {
         applyAxiosError(error, setRequestError);
      }
   };

   useLayoutEffect(() => {
      navigation.setOptions({
         headerRight: () => <Button title={t('create')} onPress={form.handleSubmit(handleCreate)} />,
      });
   }, [form]);

   return (
      <>
         {requestError && <Text>{requestError}</Text>}
         <ProductEditor form={form} />
      </>
   );
}

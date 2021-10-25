import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { RootNavigatorParamList } from 'src/RootNavigator';
import api from 'src/services/api';
import { ProductContributionDto } from 'src/types';
import { axiosErrorToString } from 'src/utils/error-utils';
import ProductContributionView from './ProductContributionView';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   route: RouteProp<RootNavigatorParamList, 'ProductContributions'>;
};

export default function ProductContributionsScreen({
   route: {
      params: { product },
   },
}: Props) {
   const [contributions, setContributions] = useState<ProductContributionDto[] | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const refreshContributions = async () => {
      setIsLoading(true);
      setError(null);
      try {
         const result = await api.product.getProductContributions(product.id);
         setContributions(result);
      } catch (error) {
         const axiosError = error as AxiosError;
         if (axiosError.isAxiosError) {
            setError(axiosErrorToString(axiosError));
         } else {
            setError((error as any).toString());
         }
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      refreshContributions();
   }, []);

   if (error) {
      return <Text>{error}</Text>;
   }

   if (!contributions) {
      return <Text>Loading...</Text>;
   }

   return (
      <FlatList
         data={_.orderBy(contributions, (x) => x.createdOn, 'desc')}
         keyExtractor={({ id }) => id}
         refreshing={isLoading}
         onRefresh={() => refreshContributions()}
         renderItem={({ item }) => <ProductContributionView data={item} />}
      />
   );
}

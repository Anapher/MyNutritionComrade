import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import _ from 'lodash';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import FullScreenError from 'src/components/FullScreenError';
import FullScreenLoading from 'src/components/FullScreenLoading';
import SettingItem from 'src/components/Settings/SettingItem';
import useRequestData from 'src/hooks/useRequestData';
import { RootNavigatorParamList } from 'src/RootNavigator';
import api from 'src/services/api';
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
   const [contributions, isLoading, error, onRetry] = useRequestData(() =>
      api.product.getProductContributions(product.id),
   );

   const { bottom } = useSafeAreaInsets();

   if (isLoading) {
      return <FullScreenLoading />;
   }

   if (error) {
      return <FullScreenError errorMessage={error} onRetry={onRetry} />;
   }

   return (
      <FlatList
         style={styles.list}
         data={_.orderBy(
            contributions,
            [(x) => x.status === 'pending', (x) => x.yourVote, (x) => x.createdOn],
            ['desc', 'asc', 'desc'],
         )}
         keyExtractor={({ id }) => id}
         refreshing={isLoading}
         onRefresh={() => onRetry()}
         renderItem={({ item }) => (
            <SettingItem itemContextOverride={{ top: true, bottom: true }} style={styles.item} padding>
               <ProductContributionView data={item} product={product} />
            </SettingItem>
         )}
         ListFooterComponent={() => <View style={{ marginBottom: bottom }} />}
      />
   );
}

const styles = StyleSheet.create({
   item: {
      marginBottom: 16,
      paddingVertical: 16,
   },
   list: {
      paddingVertical: 16,
      paddingHorizontal: 16,
   },
});

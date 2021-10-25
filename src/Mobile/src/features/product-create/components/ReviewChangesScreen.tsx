import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import getPatchView from 'src/components-domain/ProductPatchGroup';
import ProductPatchStatusChip from 'src/components-domain/ProductPatchStatusChip';
import SettingItem from 'src/components/Settings/SettingItem';
import useSafeRequest from 'src/hooks/useSafeRequest';
import { RootNavigatorParamList } from 'src/RootNavigator';
import api from 'src/services/api';

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   route: RouteProp<RootNavigatorParamList, 'ReviewProductChanges'>;
};

export default function ReviewChangesScreen({
   route: {
      params: { product, changes },
   },
   navigation,
}: Props) {
   const { t } = useTranslation();
   const changeViews = changes.map((x) => getPatchView(x.operations, product, t));
   const { makeSafeRequest } = useSafeRequest();

   const handleSubmit = async () => {
      await makeSafeRequest(
         async () =>
            await api.product.patchProduct(
               product.id,
               changes.flatMap((x) => x.operations),
            ),
         true,
      );

      navigation.pop(2);
   };

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: t('review_changes.title'),
         headerRight: () => <Button title={t('submit')} onPress={handleSubmit} />,
      });
   }, []);

   return (
      <FlatList
         data={changeViews}
         keyExtractor={(_, i) => i.toString()}
         style={{ padding: 16 }}
         renderItem={({ item }) => (
            <SettingItem itemContextOverride={{ top: true, bottom: true }} style={styles.item} padding>
               <>
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                     <ProductPatchStatusChip status={item.type} />
                     <Text style={styles.titleText}>{item.title}</Text>
                  </View>
                  <View style={{ marginTop: 16 }}>{item.view}</View>
               </>
            </SettingItem>
         )}
      />
   );
}

const styles = StyleSheet.create({
   item: {
      marginBottom: 16,
      paddingVertical: 16,
   },
   titleText: {
      fontSize: 16,
      marginLeft: 8,
   },
});

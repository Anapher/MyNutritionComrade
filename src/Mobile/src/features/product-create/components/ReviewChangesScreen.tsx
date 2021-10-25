import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import getPatchView from 'src/components-domain/ProductPatchGroup';
import { OperationType } from 'src/components-domain/ProductPatchGroup/utils';
import { BORDER_ROUNDING } from 'src/components/Settings/config';
import SettingItem from 'src/components/Settings/SettingItem';
import useSafeRequest from 'src/hooks/useSafeRequest';
import { RootNavigatorParamList } from 'src/RootNavigator';
import api from 'src/services/api';

const operationTypeStyles: {
   [key in OperationType]: {
      title: string;
      color: string;
   };
} = {
   add: {
      title: 'Add',
      color: '#27ae60',
   },
   remove: {
      title: 'Remove',
      color: '#c0392b',
   },
   modify: {
      title: 'Modify',
      color: '#2980b9',
   },
   initialize: {
      title: 'Initialize',
      color: '#8e44ad',
   },
};

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
                     <View style={[styles.statusChip, { backgroundColor: operationTypeStyles[item.type].color }]}>
                        <Text>{item.type}</Text>
                     </View>
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
   statusChip: {
      borderRadius: BORDER_ROUNDING,
      borderWidth: 0,
      paddingHorizontal: 8,
      paddingVertical: 2,
      width: 64,
      display: 'flex',
      alignItems: 'center',
   },
});

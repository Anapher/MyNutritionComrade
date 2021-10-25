import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { BORDER_ROUNDING } from 'src/components/Settings/config';
import { OperationType } from './ProductPatchGroup/utils';

const operationTypeStyles: {
   [key in OperationType]: {
      color: string;
   };
} = {
   add: {
      color: '#27ae60',
   },
   remove: {
      color: '#c0392b',
   },
   modify: {
      color: '#2980b9',
   },
   initialize: {
      color: '#8e44ad',
   },
};

type Props = {
   status: OperationType;
};
export default function ProductPatchStatusChip({ status }: Props) {
   const { color } = operationTypeStyles[status];
   const { t } = useTranslation();

   return (
      <View style={[styles.statusChip, { backgroundColor: color }]}>
         <Text>{t(`review_changes.type.${status}`)}</Text>
      </View>
   );
}

const styles = StyleSheet.create({
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

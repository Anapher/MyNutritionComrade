import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
   message?: string;
};

export default function FullScreenLoading({ message }: Props) {
   const { t } = useTranslation();

   return (
      <View style={styles.root}>
         <View style={styles.row}>
            <ActivityIndicator style={styles.loadingIndicator} />
            <Text>{message || t('loading_message')}</Text>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   root: {
      ...StyleSheet.absoluteFillObject,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
   },
   row: {
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'row',
   },
   loadingIndicator: {
      marginRight: 8,
   },
});

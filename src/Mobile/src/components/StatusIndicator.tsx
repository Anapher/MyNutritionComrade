import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type Props = {
   status: 'none' | 'loading' | 'error';
   loadingText?: string;
   errorMessage?: string;
};

export default function StatusIndicator({ status, loadingText, errorMessage }: Props) {
   const theme = useTheme();

   if (status === 'none') return null;

   if (status === 'error') {
      <View style={styles.root}>
         <Text style={{ color: theme.colors.error }}>{errorMessage || 'An error occurred'}</Text>
      </View>;
   }

   return (
      <View style={styles.root}>
         {status === 'loading' && <ActivityIndicator style={styles.loadingIndicator} />}
         <Text>{loadingText || 'Loading...'}</Text>
      </View>
   );
}

const styles = StyleSheet.create({
   root: {
      marginHorizontal: 16,
      marginTop: 16,
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'row',
   },
   loadingIndicator: {
      marginRight: 8,
   },
});

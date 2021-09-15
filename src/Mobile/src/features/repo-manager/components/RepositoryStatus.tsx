import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectInitializationResultStatus } from '../selectors';

export default function RepositoryStatus() {
   const initializationStatus = useSelector(selectInitializationResultStatus);

   if (initializationStatus === 'ready') return null;

   return (
      <View style={styles.container}>
         <Text style={styles.text}>{initializationStatus?.toString()}</Text>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      paddingVertical: 4,
      backgroundColor: '#3498db',
   },
   text: {
      textAlign: 'center',
   },
});

export function withRepoStatus<P extends object>(Component: React.ComponentType<P>) {
   return (props: P) => (
      <View style={{ flex: 1 }}>
         <View style={{ flex: 1 }}>
            <Component {...props} />
         </View>
         <RepositoryStatus />
      </View>
   );
}

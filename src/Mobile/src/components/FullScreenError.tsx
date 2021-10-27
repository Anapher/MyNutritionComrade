import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type Props = {
   errorMessage: string;
   onRetry?: () => void;
};

export default function FullScreenError({ errorMessage, onRetry }: Props) {
   const theme = useTheme();
   const { t } = useTranslation();

   return (
      <View style={styles.root}>
         <Text style={{ color: theme.colors.error }}>{errorMessage}</Text>
         {onRetry && (
            <View style={styles.retryButton}>
               <Button onPress={onRetry} title={t('common:retry')} />
            </View>
         )}
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
   retryButton: {
      marginTop: 16,
   },
});

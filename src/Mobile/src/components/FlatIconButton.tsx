import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
   buttonContent: {
      alignItems: 'center',
      flexDirection: 'row',
      padding: 8,
      paddingTop: 12,
      paddingBottom: 12,
   },
});

type FlatIconButtonProps = {
   icon: string;
   margin: number;
   onPress?: () => void | null;
   longPressInfo?: string;
   disabled?: boolean;
};

function getToastCallback(text?: string) {
   if (!text) return;
   return () => ToastAndroid.show(text, ToastAndroid.SHORT);
}

export default function FlatIconButton({ icon, margin, onPress, longPressInfo, disabled }: FlatIconButtonProps) {
   const theme = useTheme();

   return (
      <TouchableRipple
         onPress={disabled ? undefined : onPress}
         borderless
         onLongPress={disabled ? undefined : getToastCallback(longPressInfo)}
      >
         <View style={[styles.buttonContent, { opacity: disabled ? 0.34 : 1 }]}>
            <Icon name={icon} size={20} color={theme.colors.text} style={{ marginRight: margin, marginLeft: margin }} />
         </View>
      </TouchableRipple>
   );
}

import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import { Text } from 'react-native-paper';
import { DEFAULT_HEIGHT } from '../config';
import SettingItem, { SettingItemProps } from '../SettingItem';

type Props = SettingItemProps & {
   title: string;
   titleStyle?: StyleProp<TextStyle>;
   placeholder?: string;
   children?: React.ReactNode | string;
};

export default function SettingsReadOnlyKeyValue({ title, placeholder, titleStyle, children, ...props }: Props) {
   if (typeof children === 'string') {
      children = <Text style={styles.valueText}>{children}</Text>;
   }

   return (
      <SettingItem {...props}>
         <View style={styles.container}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            <View style={styles.value}>{children}</View>
         </View>
      </SettingItem>
   );
}

const styles = StyleSheet.create({
   container: {
      display: 'flex',
      flexDirection: 'row',
      marginHorizontal: 24,
      height: DEFAULT_HEIGHT,
      alignItems: 'center',
   },
   title: {
      fontSize: 14,
      marginRight: 8,
      flex: 2,
   },
   value: {
      flex: 1,
   },
   valueText: {
      fontSize: 16,
   },
});

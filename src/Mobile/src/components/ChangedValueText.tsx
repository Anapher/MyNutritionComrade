import React from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { Text } from 'react-native-paper';

type Props = {
   removed?: boolean;
   value: string;
   style?: StyleProp<TextStyle>;
};

export default function ChangedValueText({ removed, value, style }: Props) {
   return <Text style={[styles.root, removed && styles.removedText, style]}>{value}</Text>;
}

const styles = StyleSheet.create({
   root: {
      paddingHorizontal: 2,
      borderRadius: 5,
      backgroundColor: 'rgba(46, 204, 113, 0.3)',
   },
   removedText: {
      backgroundColor: 'rgba(231, 76, 60, 0.3)',
      textDecorationLine: 'line-through',
   },
});

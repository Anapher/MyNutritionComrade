import React from 'react';
import { StyleProp, StyleSheet, TextInput, TextStyle, View } from 'react-native';
import { Text } from 'react-native-paper';
import NumberTextInput from '../../NumberTextInput';
import { DEFAULT_HEIGHT } from '../config';
import ActionItem, { ActionItemProps } from './ActionItem';

type Props = ActionItemProps & {
   title: string;
   titleStyle?: StyleProp<TextStyle>;
   value: number | undefined;
   onChangeValue: (v: number | undefined) => void;
   placeholder?: string;
   inputProps?: Omit<React.ComponentProps<typeof TextInput>, 'value'>;
   rightAction?: React.ReactElement;
};

export default function ActionNumberInput({
   title,
   value,
   onChangeValue,
   placeholder,
   inputProps,
   titleStyle,
   rightAction,
   ...props
}: Props) {
   return (
      <ActionItem {...props}>
         <View style={styles.container}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            <NumberTextInput
               value={value}
               onChangeValue={onChangeValue}
               placeholder={placeholder}
               {...inputProps}
               style={[styles.numberInput, inputProps?.style]}
            />
            {rightAction}
         </View>
      </ActionItem>
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
      fontSize: 17,
      marginRight: 8,
      flex: 1,
   },
   numberInput: {
      flex: 1,
      fontSize: 17,
   },
});

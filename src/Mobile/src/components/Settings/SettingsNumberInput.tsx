import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import NumberTextInput from '../NumberTextInput';
import SettingsButtonContainer, { SettingsButtonContainerProps } from './SettingsButtonContainer';

type Props = SettingsButtonContainerProps & {
   title: string;
   value: number | undefined;
   onChangeValue: (v: number | undefined) => void;
   placeholder?: string;
};

export default function SettingsNumberInput({ title, value, onChangeValue, placeholder, ...props }: Props) {
   return (
      <SettingsButtonContainer {...props}>
         <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <NumberTextInput
               style={styles.numberInput}
               value={value}
               onChangeValue={onChangeValue}
               placeholder={placeholder}
            />
         </View>
      </SettingsButtonContainer>
   );
}

const styles = StyleSheet.create({
   container: {
      display: 'flex',
      flexDirection: 'row',
      marginVertical: 8,
      marginHorizontal: 24,
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

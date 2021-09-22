import React from 'react';
import { StyleProp, StyleSheet, TextInput, TextStyle, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { DEFAULT_HEIGHT } from './config';
import SettingsButtonContainer, { SettingsButtonContainerProps } from './SettingsButtonContainer';

type Props = SettingsButtonContainerProps & {
   title: string;
   value: string | undefined | null;
   onChangeValue: (v: string | undefined) => void;
   placeholder?: string;
   titleStyle?: StyleProp<TextStyle>;
};

export default function SettingsTextInput({ title, value, onChangeValue, placeholder, titleStyle, ...props }: Props) {
   const theme = useTheme();

   return (
      <SettingsButtonContainer {...props}>
         <View style={styles.container}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            <TextInput
               style={[
                  styles.input,
                  {
                     color: theme.colors.text,
                  },
               ]}
               value={value ?? undefined}
               onChangeText={onChangeValue}
               placeholder={placeholder}
               placeholderTextColor={theme.colors.disabled}
            />
         </View>
      </SettingsButtonContainer>
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
   input: {
      flex: 1,
      fontSize: 17,
   },
});

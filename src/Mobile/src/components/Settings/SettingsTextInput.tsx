import React from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { DEFAULT_HEIGHT } from './config';
import SettingsButtonContainer, { SettingsButtonContainerProps } from './SettingsButtonContainer';

type Props = SettingsButtonContainerProps & {
   title: string;
   value: string | undefined | null;
   onChangeValue: (v: string | undefined) => void;
   placeholder?: string;
   titleStyle?: StyleProp<TextStyle>;
   autoFocus?: boolean;
   inputProps?: TextInputProps;
   error?: string;
};

export default function SettingsTextInput({
   title,
   value,
   onChangeValue,
   placeholder,
   titleStyle,
   autoFocus,
   inputProps,
   error,
   ...props
}: Props) {
   const theme = useTheme();

   return (
      <SettingsButtonContainer {...props}>
         <View style={styles.root}>
            <View style={styles.container}>
               <Text style={[styles.title, error ? { color: theme.colors.text } : undefined, titleStyle]}>{title}</Text>
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
                  autoFocus={autoFocus}
                  {...inputProps}
               />
            </View>
            {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
         </View>
      </SettingsButtonContainer>
   );
}

const styles = StyleSheet.create({
   root: {
      marginHorizontal: 24,
   },
   container: {
      display: 'flex',
      flexDirection: 'row',

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
   errorText: {
      marginVertical: 8,
      fontSize: 12,
   },
});

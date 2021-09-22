import Color from 'color';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Divider, Surface, useTheme } from 'react-native-paper';
import { BORDER_ROUNDING, TEXT_PADDING_LEFT } from './config';

export type SettingsButtonContainerProps = {
   top?: boolean;
   bottom?: boolean;
   style?: ViewStyle;
   padding?: boolean;
};

type Props = SettingsButtonContainerProps & { children?: React.ReactElement };

export default function SettingsButtonContainer({ children, top, bottom, style, padding }: Props) {
   const theme = useTheme();

   return (
      <Surface
         style={[
            {
               backgroundColor: Color(theme.colors.text).alpha(0.06).rgb().string(),
            },
            top ? styles.surfaceTop : undefined,
            bottom ? styles.surfaceBottom : undefined,
            style,
         ]}
      >
         <View>
            {padding ? <View style={styles.padding}>{children}</View> : children}
            {!bottom && (
               <Divider
                  style={[
                     styles.dividerInset,
                     { backgroundColor: Color(theme.colors.disabled).alpha(0.18).rgb().string() },
                  ]}
               />
            )}
         </View>
      </Surface>
   );
}

const styles = StyleSheet.create({
   padding: { paddingHorizontal: TEXT_PADDING_LEFT },
   dividerInset: {
      marginLeft: TEXT_PADDING_LEFT,
   },
   surfaceTop: {
      borderTopLeftRadius: BORDER_ROUNDING,
      borderTopRightRadius: BORDER_ROUNDING,
   },
   surfaceBottom: {
      borderBottomLeftRadius: BORDER_ROUNDING,
      borderBottomRightRadius: BORDER_ROUNDING,
   },
});

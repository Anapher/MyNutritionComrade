import Color from 'color';
import React, { useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Divider, Surface, useTheme } from 'react-native-paper';
import { BORDER_ROUNDING, TEXT_PADDING_LEFT } from '../config';
import { ItemContext, ItemContextInfo } from '../ItemContext';

export type ActionItemProps = {
   children?: React.ReactChild;
   padding?: boolean;
   style?: ViewStyle;
   itemContextOverride?: ItemContextInfo;
};

export default function ActionItem({ itemContextOverride, style, padding, children }: ActionItemProps) {
   const theme = useTheme();
   const context = useContext(ItemContext);

   const { top, bottom } = itemContextOverride || context;

   return (
      <Surface
         style={[
            {
               backgroundColor: Color(theme.colors.onSurface).alpha(0.06).rgb().string(),
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
                     { backgroundColor: Color(theme.colors.onSurfaceDisabled).alpha(0.18).rgb().string() },
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

import Color from 'color';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Divider, Surface, useTheme } from 'react-native-paper';

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
      <Surface style={[{ backgroundColor: Color(theme.colors.text).alpha(0.06).rgb().string() }, style]}>
         <View>
            {top && <Divider />}
            {padding ? <View style={styles.padding}>{children}</View> : children}
            <Divider style={bottom ? undefined : styles.dividerInset} />
         </View>
      </Surface>
   );
}

const styles = StyleSheet.create({
   padding: { paddingHorizontal: 24 },
   dividerInset: {
      marginLeft: 24,
   },
});

import Color from 'color';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Divider, Surface, useTheme } from 'react-native-paper';

export type SettingsButtonContainerProps = {
   top?: boolean;
   bottom?: boolean;
   style?: ViewStyle;
};

type Props = SettingsButtonContainerProps & { children?: React.ReactElement };

export default function SettingsButtonContainer({ children, top, bottom, style }: Props) {
   const theme = useTheme();

   return (
      <Surface style={[styles.root, { backgroundColor: Color(theme.colors.text).alpha(0.06).rgb().string() }, style]}>
         <View>
            {top && <Divider />}
            {children}
            <Divider style={bottom ? undefined : styles.dividerInset} />
         </View>
      </Surface>
   );
}

const styles = StyleSheet.create({
   root: {},
   dividerInset: {
      marginLeft: 24,
   },
});

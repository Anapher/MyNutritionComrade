import Color from 'color';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
   onPress: () => void;
   title: string;
   caption?: string;
};

export default function SettingsButton({ onPress, title, caption }: Props) {
   const theme = useTheme();

   return (
      <Surface style={[styles.root, { backgroundColor: Color(theme.colors.text).alpha(0.15).rgb().string() }]}>
         <TouchableRipple onPress={onPress} style={styles.container}>
            <View style={styles.content}>
               <View>
                  <Text style={{ fontSize: 15 }}>{title}</Text>
                  {caption && <Caption>{caption}</Caption>}
               </View>
               <Icon name="chevron-right" size={32} color={theme.colors.primary} />
            </View>
         </TouchableRipple>
      </Surface>
   );
}

const styles = StyleSheet.create({
   root: {},
   container: {
      paddingVertical: 8,
      paddingHorizontal: 16,
   },
   content: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
});

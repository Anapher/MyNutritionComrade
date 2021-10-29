import React, { useContext } from 'react';
import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import { Caption, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BORDER_ROUNDING, DEFAULT_HEIGHT, TEXT_PADDING_LEFT } from '../config';
import { ItemContext } from '../ItemContext';
import ActionItem, { ActionItemProps } from './ActionItem';

type Props = ActionItemProps & {
   onPress?: () => void;
   title: string;
   secondary?: string;
   showSecondaryBelow?: boolean;
   icon?: 'arrow';
   formLayout?: boolean;
   selectable?: boolean;
   selected?: boolean;
   textStyles?: StyleProp<TextStyle>;
   titleSingleLine?: boolean;
};

export default function ActionButtonLink({
   onPress,
   title,
   secondary,
   showSecondaryBelow,
   icon,
   formLayout,
   selectable,
   selected,
   textStyles,
   titleSingleLine,
   ...props
}: Props) {
   const theme = useTheme();
   const { top, bottom } = useContext(ItemContext);

   return (
      <ActionItem {...props}>
         <TouchableRipple
            onPress={onPress}
            style={[
               styles.container,
               showSecondaryBelow ? undefined : styles.maxHeight,
               top ? styles.surfaceTop : undefined,
               bottom ? styles.surfaceBottom : undefined,
            ]}
         >
            <View style={styles.content}>
               <View style={[styles.textContainer, showSecondaryBelow ? undefined : styles.rowView]}>
                  <Text
                     numberOfLines={titleSingleLine ? 1 : undefined}
                     style={[styles.title, textStyles, formLayout && { flex: 1 }]}
                  >
                     {title}
                  </Text>
                  {!showSecondaryBelow && (
                     <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.secondary, !formLayout && { textAlign: 'right', color: theme.colors.disabled }]}
                     >
                        {secondary}
                     </Text>
                  )}
                  {showSecondaryBelow && secondary !== undefined && <Caption>{secondary}</Caption>}
               </View>
               {icon === 'arrow' && (
                  <Icon name="chevron-right" size={28} style={{ marginVertical: -2 }} color={theme.colors.disabled} />
               )}
               {selectable && (
                  <Icon name="check" style={{ opacity: selected ? 1 : 0 }} size={22} color={theme.colors.primary} />
               )}
            </View>
         </TouchableRipple>
      </ActionItem>
   );
}

const styles = StyleSheet.create({
   container: {
      paddingVertical: 8,
      paddingHorizontal: TEXT_PADDING_LEFT,
   },
   surfaceTop: {
      borderTopLeftRadius: BORDER_ROUNDING,
      borderTopRightRadius: BORDER_ROUNDING,
   },
   surfaceBottom: {
      borderBottomLeftRadius: BORDER_ROUNDING,
      borderBottomRightRadius: BORDER_ROUNDING,
   },
   title: {
      fontSize: 17,
      marginRight: 8,
   },
   secondary: {
      fontSize: 17,
      flex: 1,
      minWidth: 0,
   },
   content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   textContainer: {
      flex: 1,
   },
   rowView: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1,
   },
   maxHeight: {
      height: DEFAULT_HEIGHT,
   },
});

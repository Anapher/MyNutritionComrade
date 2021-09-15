import { View, StyleProp, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import React from 'react';

type TileProps = {
   caption: string;
   value: string;
   text: string;
   fat?: boolean;
   valueColor?: string;
   style?: StyleProp<ViewStyle>;
};

export default function Tile({ caption, value, text, fat, valueColor, style }: TileProps) {
   return (
      <View style={[{ display: 'flex', alignItems: 'center', flexDirection: 'column' }, style]}>
         <Text style={{ letterSpacing: 0.4, fontSize: 12, opacity: 0.6 }}>{caption}</Text>
         <Text
            style={[
               {
                  fontSize: 16,
                  letterSpacing: 0.5,
                  fontWeight: fat !== undefined ? 'bold' : undefined,
               },
               valueColor !== undefined ? { color: valueColor } : undefined,
            ]}
         >
            {value}
         </Text>
         <Text style={{ fontSize: 10 }}>{text}</Text>
      </View>
   );
}

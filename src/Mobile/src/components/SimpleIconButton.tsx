import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = PressableProps & {
   icon: string;
};

export default function SimpleIconButton({ icon, ...props }: Props) {
   return (
      <Pressable
         {...props}
         style={({ pressed }) => [
            {
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               padding: 4,
               paddingVertical: 6,
               opacity: pressed ? 0.5 : 1,
            },
         ]}
      >
         <Icon name={icon} color="#2961fe" size={24} />
      </Pressable>
   );
}

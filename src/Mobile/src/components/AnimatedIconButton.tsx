import React, { useCallback, useRef } from 'react';
import { Animated, StyleProp, View, ViewStyle } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

type Props = {
   name: string;
   size: number;
   color?: string;
   onPress?: () => void;
   disabled?: boolean;
   style?: StyleProp<ViewStyle>;
};
export default function AnimatedIconButton({ name, size, onPress, color = 'black', disabled, style }: Props) {
   const animation = useRef(new Animated.Value(0)).current;

   const onTouchablePress = useCallback(() => {
      animation.setValue(0);
      Animated.timing(animation, {
         toValue: 1,
         duration: 600,
         useNativeDriver: false,
      }).start();
      onPress!();
   }, [onPress, animation]);

   return (
      <TouchableWithoutFeedback
         disabled={disabled}
         onPress={onPress === undefined ? undefined : onTouchablePress}
         style={style}
      >
         <View style={{ position: 'relative' }}>
            <Icon name={name} size={size} color={color} />
            <AnimatedIcon
               name={name}
               color={color}
               size={size}
               style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  zIndex: 100000,
                  transform: [
                     {
                        scale: animation.interpolate({
                           inputRange: [0, 1],
                           outputRange: [1, 3],
                        }),
                     },
                  ],
                  opacity: animation.interpolate({
                     inputRange: [0, 1],
                     outputRange: [1, 0],
                  }),
               }}
            />
         </View>
      </TouchableWithoutFeedback>
   );
}

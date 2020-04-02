import { Animated, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRef, useCallback } from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

type Props = {
    name: string;
    size: number;
    color?: string;
    onPress?: () => void;
    disabled?: boolean;
};
export default function AnimatedIconButton({ name, size, onPress, color = 'black', disabled }: Props) {
    const animation = useRef(new Animated.Value(0)).current;

    const onTouchablePress = useCallback(() => {
        animation.setValue(0);
        Animated.timing(animation, {
            toValue: 1,
            duration: 600,
        }).start();
        onPress!();
    }, [onPress, animation]);

    return (
        <TouchableWithoutFeedback disabled={disabled} onPress={onPress === undefined ? undefined : onTouchablePress}>
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

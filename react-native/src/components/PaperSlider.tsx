import React from 'react';
import { StyleSheet, View, Slider, SliderProps } from 'react-native';
import { useTheme, Caption, Text } from 'react-native-paper';

type Props = SliderProps & { showLabel?: boolean; unit?: string };

const PaperSlider = ({ showLabel = true, unit, ...props }: Props) => {
    const theme = useTheme();
    const { minimumValue, maximumValue, value } = props;

    const unitText = unit && ` ${unit}`;

    return (
        <View>
            <Slider
                minimumTrackTintColor={theme.colors.primary}
                thumbTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.text}
                {...props}
            />
            {showLabel && (
                <View style={styles.scalarContainer}>
                    <Caption>
                        {minimumValue}
                        {unitText}
                    </Caption>
                    <Text>
                        {value}
                        {unitText}
                    </Text>
                    <Caption>
                        {maximumValue}
                        {unitText}
                    </Caption>
                </View>
            )}
        </View>
    );
};

export default PaperSlider;

const styles = StyleSheet.create({
    scalarContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
});

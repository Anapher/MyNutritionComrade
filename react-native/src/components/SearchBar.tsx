import color from 'color';
import React from 'react';
import { I18nManager, StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import { IconButton, TextInput, Theme, withTheme } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/src/components/Icon';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 18,
        paddingLeft: 8,
        alignSelf: 'stretch',
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        minWidth: 0,
    },
});

type Props = React.ComponentProps<typeof TextInput> & {
    /**
     * Hint text shown when the input is empty.
     */
    placeholder?: string;
    /**
     * The value of the text input.
     */
    value: string;
    /**
     * Callback that is called when the text input's text changes.
     */
    onChangeText?: (query: string) => void;
    /**
     * Set style of the TextInput component inside the searchbar
     */
    inputStyle?: StyleProp<TextStyle>;

    /**
     * @optional
     */
    theme: Theme;
    /**
     * Custom color for icon, default will be derived from theme
     */
    iconColor?: string;
    /**
     * Custom icon for clear button, default will be icon close
     */
    clearIcon?: IconSource;
};

function SearchBar({ placeholder, value, theme, iconColor: customIconColor, clearIcon, inputStyle, ...rest }: Props) {
    const { colors, dark, fonts } = theme;
    const textColor = colors.text;
    const font = fonts.regular;
    const iconColor =
        customIconColor ||
        (dark
            ? textColor
            : color(textColor)
                  .alpha(0.54)
                  .rgb()
                  .string());
    const rippleColor = color(textColor)
        .alpha(0.32)
        .rgb()
        .string();

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, { color: textColor, ...font }, inputStyle]}
                placeholder={placeholder || ''}
                placeholderTextColor={colors.placeholder}
                selectionColor={colors.primary}
                underlineColorAndroid="transparent"
                returnKeyType="search"
                keyboardAppearance={dark ? 'dark' : 'light'}
                accessibilityTraits="search"
                accessibilityRole="search"
                value={value}
                {...rest}
            />
            <IconButton
                borderless
                disabled={!value}
                color={value ? iconColor : 'rgba(255, 255, 255, 0)'}
                rippleColor={rippleColor}
                onPress={() => rest.onChangeText('')}
                icon="close"
                accessibilityTraits="button"
                accessibilityComponentType="button"
                accessibilityRole="button"
            />
        </View>
    );
}

export default withTheme(SearchBar);

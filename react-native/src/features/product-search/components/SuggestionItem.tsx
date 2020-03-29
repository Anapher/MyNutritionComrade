import { FoodSuggestion } from 'Models';
import React from 'react';
import { List, TouchableRipple, Text, Caption, Theme, withTheme } from 'react-native-paper';
import selectLabel from 'src/utils/label-selector';
import { View, StyleSheet } from 'react-native';
import color from 'color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
    item: FoodSuggestion;
    theme: Theme;
    onPress: () => void;
};

const styles = StyleSheet.create({
    item: {
        paddingVertical: 12,
    },
    itemContent: {
        display: 'flex',
        flexDirection: 'row',
    },
    iconContent: {
        width: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
    },
    description: {
        fontSize: 12,
    },
});

function SuggestionItem({ item, theme, onPress }: Props) {
    const iconColor = color(theme.colors.text).alpha(0.87).rgb().string();
    const descriptionColor = color(theme.colors.text).alpha(0.54).rgb().string();

    return (
        <TouchableRipple onPress={onPress} style={styles.item}>
            <View style={styles.itemContent}>
                <View style={styles.iconContent}>
                    <Icon name="plus" color={iconColor} size={24} />
                </View>
                <View>
                    <Text style={[styles.title, { color: theme.colors.text }]}>{selectLabel(item.model.label)}</Text>
                    <Text style={[styles.description, { color: descriptionColor }]}>
                        {item.servingSize
                            ? `${item.servingSize?.size} ${
                                  item.servingSize?.conversion?.name || item.servingSize?.unit
                              }`
                            : 'Tap to choose volume'}
                    </Text>
                </View>
            </View>
        </TouchableRipple>
    );
}

export default withTheme(SuggestionItem);

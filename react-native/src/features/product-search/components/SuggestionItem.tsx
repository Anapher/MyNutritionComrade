import color from 'color';
import { SearchResult } from 'Models';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Theme, TouchableRipple, withTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import selectLabel from 'src/utils/product-utils';
import { getGeneratedMealName } from 'src/utils/food-utils';

type Props = {
    item: SearchResult;
    theme: Theme;
    onPress: () => void;
};

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
                    <Text style={[styles.title, { color: theme.colors.text }]}>{getTitle(item)}</Text>
                    <Text style={[styles.description, { color: descriptionColor }]}>{getDescription(item)}</Text>
                </View>
            </View>
        </TouchableRipple>
    );
}

function getTitle(s: SearchResult): string {
    switch (s.type) {
        case 'product':
            return selectLabel(s.product.label);
        case 'serving':
            return selectLabel(s.product.label);
        case 'meal':
            return s.name;
        case 'custom':
            return s.label || 'Custom product';
        case 'generatedMeal':
            return getGeneratedMealName(s);
    }
}

function getDescription(s: SearchResult): string {
    switch (s.type) {
        case 'product':
            return 'Tap to choose volume';
        case 'serving':
            if (s.convertedFrom !== undefined)
                return `${s.amount * (1 / s.convertedFrom.factor)} ${s.convertedFrom.name}`;
            return `${s.amount} ${s.servingType}`;
        case 'meal':
            return '';
        case 'custom':
            return 'todo';
        case 'generatedMeal':
            return 'todo';
    }
}

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
        fontSize: 14,
    },
    description: {
        fontSize: 12,
    },
});

export default withTheme(SuggestionItem);

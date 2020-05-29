import color from 'color';
import { SearchResult, FoodPortionDto } from 'Models';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Theme, TouchableRipple, withTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import selectLabel from 'src/utils/product-utils';
import { suggestionIdToString } from 'src/utils/food-utils';
import _ from 'lodash';
import { roundNumber } from 'src/utils/string-utils';

type Props = {
    item: SearchResult;
    theme: Theme;
    onPress: () => void;
};

function SuggestionItem({ item, theme, onPress }: Props) {
    const iconColor = color(theme.colors.text).alpha(0.87).rgb().string();
    const descriptionColor = color(theme.colors.text).alpha(0.54).rgb().string();

    const title = getTitle(item);
    const description = getDescription(item);
    const icon = getIcon(item);

    return (
        <TouchableRipple onPress={onPress} style={styles.item}>
            <View style={styles.itemContent}>
                <View style={styles.iconContent}>{icon && <Icon name={icon} color={iconColor} size={24} />}</View>
                <View>
                    <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
                    {description !== undefined && (
                        <Text style={[styles.description, { color: descriptionColor }]}>{description}</Text>
                    )}
                </View>
            </View>
        </TouchableRipple>
    );
}

function getIcon(s: SearchResult): string | null {
    switch (s.type) {
        case 'product':
            return null;
        case 'serving':
            return 'plus';
        case 'meal':
            return 'silverware-fork-knife';
        case 'custom':
            return null;
        case 'generatedMeal':
            return 'plus';
    }
}

function getTitle(s: SearchResult): string {
    switch (s.type) {
        case 'product':
            return selectLabel(s.product.label);
        case 'serving':
            return selectLabel(s.product.label);
        case 'meal':
            return s.mealName;
        case 'custom':
            return s.label || 'Custom product';
        case 'generatedMeal':
            return suggestionIdToString(s.id);
    }
}

function getDescription(s: SearchResult): string | null {
    switch (s.type) {
        case 'product':
            return 'Tap to choose volume';
        case 'serving':
            if (s.convertedFrom !== undefined)
                return `${s.amount * (1 / s.convertedFrom.factor)} ${s.convertedFrom.name}`;
            return `${s.amount} ${s.servingType}`;
        case 'meal':
            return `${roundNumber(s.nutritionalInfo.energy)} kcal`;
        case 'custom':
            return 'todo';
        case 'generatedMeal':
            return _.sortBy(s.items, (x) => x.nutritionalInfo.energy)
                .map(getName)
                .join(', ');
    }
}

function getName(dto: FoodPortionDto): string {
    switch (dto.type) {
        case 'custom':
            return dto.label || 'Custom product';
        case 'product':
            return selectLabel(dto.product.label);
        case 'meal':
            return dto.mealName;
        case 'suggestion':
            return suggestionIdToString(dto.suggestionId);
    }
}

const styles = StyleSheet.create({
    item: {
        height: 60,
        paddingVertical: 12,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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

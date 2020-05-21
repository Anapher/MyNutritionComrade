import Color from 'color';
import { FoodPortionCustomDto, FoodPortionDto, FoodPortionProductDto, NutritionalInfo } from 'Models';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import selectLabel, { isProductLiquid } from 'src/utils/product-utils';
import { roundNumber } from 'src/utils/string-utils';
import { styles } from './food-portion-styles';

interface Props<T extends FoodPortionDto> {
    onPress?: () => void;
    onLongPress?: () => void;
    foodPortion: T;
}

export function ProductFoodPortionView({ onPress, onLongPress, foodPortion }: Props<FoodPortionProductDto>) {
    return (
        <FoodPortionItem
            onPress={onPress}
            onLongPress={onLongPress}
            label={selectLabel(foodPortion.product.label)}
            nutritionalInfo={foodPortion.nutritionalInfo}
            isLiquid={isProductLiquid(foodPortion.product)}
        />
    );
}

export function CustomFoodPortionView({ onPress, onLongPress, foodPortion }: Props<FoodPortionCustomDto>) {
    return (
        <FoodPortionItem
            onPress={onPress}
            onLongPress={onLongPress}
            label={foodPortion.label || 'Manual food'}
            nutritionalInfo={foodPortion.nutritionalInfo}
            isLiquid={false}
        />
    );
}

type FoodPortionItemProps = {
    onPress?: () => void;
    onLongPress?: () => void;

    label: string;
    nutritionalInfo: NutritionalInfo;
    isLiquid: boolean;
};

function FoodPortionItem({ onLongPress, onPress, nutritionalInfo, label, isLiquid }: FoodPortionItemProps) {
    const theme = useTheme();

    const titleColor = Color(theme.colors.text).alpha(0.87).rgb().string();
    const descriptionColor = Color(theme.colors.text).alpha(0.7).rgb().string();
    const descriptionBColor = Color(theme.colors.text).alpha(0.4).rgb().string();

    const kcalColor = Color(theme.colors.text).alpha(0.8).rgb().string();
    const rippleColor = 'black';

    const { fat, carbohydrates, protein, volume, energy } = nutritionalInfo;

    return (
        <Surface style={styles.surface}>
            <TouchableRipple
                onPress={onPress && (() => onPress())}
                onLongPress={onLongPress && (() => onLongPress())}
                rippleColor={rippleColor}
                style={styles.root}
            >
                <View style={[styles.row, styles.container]}>
                    <View style={styles.flexFill}>
                        <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.title, { color: titleColor }]}>
                            {label}
                        </Text>
                        <View style={styles.verticalCenterAlignedRow}>
                            <Text style={[styles.description, { color: descriptionColor }]}>
                                {volume}
                                {isLiquid ? 'ml' : 'g'}
                            </Text>
                            <Text style={[styles.description, { color: descriptionBColor, fontSize: 11 }]}>
                                {' | '}
                                {`Fat: ${roundNumber(fat)}g | Carbs: ${roundNumber(
                                    carbohydrates,
                                )}g | Protein: ${roundNumber(protein)}g`}
                            </Text>
                        </View>
                    </View>
                    <Text style={[styles.energyText, { color: kcalColor }]}>{roundNumber(energy)} kcal</Text>
                </View>
            </TouchableRipple>
        </Surface>
    );
}

import Color from 'color';
import {
    FoodPortionCreationDto,
    FoodPortionCustomDto,
    FoodPortionDto,
    FoodPortionProductDto,
    NutritionalInfo,
    ProductFoodPortionCreationDto,
    CustomFoodPortionCreationDto,
} from 'Models';
import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import selectLabel, { isProductLiquid } from 'src/utils/product-utils';
import { roundNumber } from 'src/utils/string-utils';
import { styles } from './food-portion-styles';
import { mapFoodPortionDtoCreationDto } from 'src/utils/different-foods';

interface Props<T extends FoodPortionDto, TCreation extends FoodPortionCreationDto> {
    /** when the item is pressed. A delegate action is submitted as parameter that can be called to trigger @see {onEdit} */
    onPress?: (executeEdit: (changes: Partial<TCreation>) => void, executeRemove: () => void) => void;
    onLongPress?: (executeEdit: (changes: Partial<TCreation>) => void, executeRemove: () => void) => void;

    /** Request to edit this item with the creation dto */
    onEdit: (creationDto: TCreation) => void;
    onRemove: () => void;
    containerStyle?: StyleProp<ViewStyle>;

    foodPortion: T;
}

export function ProductFoodPortionView({
    onPress,
    onLongPress,
    foodPortion,
    onEdit,
    onRemove,
    containerStyle,
}: Props<FoodPortionProductDto, ProductFoodPortionCreationDto>) {
    const onEditDelegate = (changes: Partial<ProductFoodPortionCreationDto>) =>
        onEdit({
            ...(mapFoodPortionDtoCreationDto(foodPortion) as ProductFoodPortionCreationDto),
            ...changes,
        });

    return (
        <FoodPortionItem
            onPress={onPress && (() => onPress(onEditDelegate, onRemove))}
            onLongPress={onLongPress && (() => onLongPress(onEditDelegate, onRemove))}
            label={selectLabel(foodPortion.product.label)}
            nutritionalInfo={foodPortion.nutritionalInfo}
            isLiquid={isProductLiquid(foodPortion.product)}
            containerStyle={containerStyle}
        />
    );
}

export function CustomFoodPortionView({
    onPress,
    onLongPress,
    foodPortion,
    onEdit,
    onRemove,
    containerStyle,
}: Props<FoodPortionCustomDto, CustomFoodPortionCreationDto>) {
    const onEditDelegate = (changes: Partial<CustomFoodPortionCreationDto>) =>
        onEdit({
            ...(mapFoodPortionDtoCreationDto(foodPortion) as CustomFoodPortionCreationDto),
            ...changes,
        });

    return (
        <FoodPortionItem
            onPress={onPress && (() => onPress(onEditDelegate, onRemove))}
            onLongPress={onLongPress && (() => onLongPress(onEditDelegate, onRemove))}
            label={foodPortion.label || 'Manual food'}
            nutritionalInfo={foodPortion.nutritionalInfo}
            isLiquid={false}
            containerStyle={containerStyle}
        />
    );
}

type FoodPortionItemProps = {
    containerStyle?: StyleProp<ViewStyle>;

    onPress?: () => void;
    onLongPress?: () => void;

    label: string;
    nutritionalInfo: NutritionalInfo;
    isLiquid: boolean;
};

function FoodPortionItem({
    onLongPress,
    onPress,
    nutritionalInfo,
    label,
    isLiquid,
    containerStyle,
}: FoodPortionItemProps) {
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
                <View style={[styles.row, styles.container, containerStyle]}>
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

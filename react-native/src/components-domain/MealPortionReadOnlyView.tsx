import { useTheme } from '@react-navigation/native';
import Color from 'color';
import { FoodPortionItemDto, FoodPortionMealDto, MealFoodPortionCreationDto } from 'Models';
import React from 'react';
import { View } from 'react-native';
import { Surface, Text, TouchableRipple } from 'react-native-paper';
import selectLabel, { getBaseUnit } from 'src/utils/product-utils';
import { roundNumber } from 'src/utils/string-utils';
import { styles } from './food-portion-styles';

type MealPortionProps = {
    onPress?: (executeEdit: (changes: Partial<MealFoodPortionCreationDto>) => void, executeRemove: () => void) => void;
    onLongPress?: (
        executeEdit: (changes: Partial<MealFoodPortionCreationDto>) => void,
        executeRemove: () => void,
    ) => void;

    onEdit: (creationDto: MealFoodPortionCreationDto) => void;
    onRemove: () => void;

    meal: FoodPortionMealDto;
};

function MealPortionReadOnlyView({ onPress, onLongPress, meal, onEdit, onRemove }: MealPortionProps) {
    const theme = useTheme();

    const rippleColor = 'black';
    const titleColor = Color(theme.colors.text).alpha(0.87).rgb().string();
    const kcalColor = Color(theme.colors.text).alpha(0.8).rgb().string();

    const editDelegate: (changes: Partial<MealFoodPortionCreationDto>) => void = (changes) =>
        onEdit({ type: 'meal', mealId: meal.mealId, portion: meal.portion, ...changes });

    return (
        <Surface style={styles.surface}>
            <TouchableRipple
                onPress={onPress && (() => onPress(editDelegate, onRemove))}
                onLongPress={onLongPress && (() => onLongPress(editDelegate, onRemove))}
                rippleColor={rippleColor}
                style={styles.root}
            >
                <View style={[styles.container]}>
                    <View style={[styles.row, { marginBottom: 8 }]}>
                        <View style={styles.flexFill}>
                            <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.title, { color: titleColor }]}>
                                {meal.mealName}
                            </Text>
                        </View>
                        <Text style={[styles.energyText, { color: kcalColor }]}>
                            {roundNumber(meal.nutritionalInfo.energy)} kcal
                        </Text>
                    </View>
                    {meal.items.map((x, i) => (
                        <MealItem item={x} lastItem={i === meal.items.length - 1} key={i} textColor={titleColor} />
                    ))}
                </View>
            </TouchableRipple>
        </Surface>
    );
}

type MealItemProps = {
    item: FoodPortionItemDto;
    lastItem?: boolean;
    textColor: string;
};

function MealItem({ item, lastItem, textColor }: MealItemProps) {
    return (
        <View>
            <View style={styles.row}>
                <View style={[styles.flexFill, { display: 'flex', flexDirection: 'row', alignItems: 'stretch' }]}>
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <View style={{ backgroundColor: 'white', width: 1, flex: 1 }}></View>
                        <View style={{ backgroundColor: 'white', width: 1, height: 1 }}></View>
                        <View style={{ backgroundColor: lastItem ? 'transparent' : 'white', width: 1, flex: 1 }}></View>
                    </View>
                    <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ backgroundColor: 'white', height: 1, width: 8 }}></View>
                    </View>

                    <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={[styles.title, { marginLeft: 8, color: textColor, fontSize: 12 }]}
                    >
                        {GetText(item)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

function GetText(item: FoodPortionItemDto): string {
    switch (item.type) {
        case 'product':
            return `${item.nutritionalInfo.volume}${getBaseUnit(item.product)} ${selectLabel(item.product.label)}`;
        case 'custom':
            return `${item.nutritionalInfo.volume}g ${item.label || 'Manual Product'}`;
    }
}

export default MealPortionReadOnlyView;

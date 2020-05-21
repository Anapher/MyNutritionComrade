import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Meal, FoodPortionDto } from 'Models';
import { Text, TouchableRipple, Subheading } from 'react-native-paper';
import _ from 'lodash';
import selectLabel, { getBaseUnit } from 'src/utils/product-utils';

type Props = {
    meal: Meal;
    onOptions: () => void;
    onEdit: () => void;
};

function getFoodPortionLabel(foodPortion: FoodPortionDto): string {
    console.log(foodPortion);

    switch (foodPortion.type) {
        case 'product':
            return `${foodPortion.nutritionalInfo.volume}${getBaseUnit(foodPortion.product)} ${selectLabel(
                foodPortion.product.label,
            )}`;
        case 'custom':
            return `${foodPortion.nutritionalInfo.volume}g ${foodPortion.label || 'Manual food'} (${
                foodPortion.nutritionalInfo.energy
            } kcal)`;
        case 'meal':
            return `${foodPortion.portion.toFixed(1)} ${foodPortion.mealName}`;
        case 'suggestion':
            return `Suggestion`;
    }
}

function MealItem({ meal }: Props) {
    return (
        <TouchableRipple style={styles.root} onPress={() => {}}>
            <View>
                <Subheading>{meal.name}</Subheading>
                <Text ellipsizeMode="tail" numberOfLines={1} style={styles.descriptionText}>
                    {_.orderBy(meal.items, (x) => x.nutritionalInfo.energy, 'desc')
                        .map(getFoodPortionLabel)
                        .join(', ')}
                </Text>
            </View>
        </TouchableRipple>
    );
}

export default MealItem;

const styles = StyleSheet.create({
    root: {
        padding: 16,
    },
    descriptionText: {
        fontSize: 10,
    },
});

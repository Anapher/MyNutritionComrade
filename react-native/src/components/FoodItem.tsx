import color from 'color';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Theme, withTheme } from 'react-native-paper';

export interface FoodListItem {
    name: string;
    amount: string;

    kcal: number;
    fat: number;
    carbohydrates: number;
    protein: number;
    sugars: number;
}

type Props = {
    item: FoodListItem;
    theme: Theme;
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        flexDirection: 'row',
        marginLeft: 8,
        marginRight: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 14,
    },
    description: {
        fontSize: 12,
    },
});

function FoodItem({ item, theme }: Props) {
    const titleColor = color(theme.colors.text)
        .alpha(0.87)
        .rgb()
        .string();
    const descriptionColor = color(theme.colors.text)
        .alpha(0.7)
        .rgb()
        .string();
    const descriptionBColor = color(theme.colors.text)
        .alpha(0.4)
        .rgb()
        .string();

    const kcalColor = color(theme.colors.text)
        .alpha(0.8)
        .rgb()
        .string();

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'column' }}>
                <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.title, { color: titleColor }]}>
                    {item.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.description, { color: descriptionColor }]}>{item.amount}</Text>
                    <Text style={[styles.description, { color: descriptionBColor, fontSize: 11 }]}>
                        {' | '}
                        {`Fat: ${item.fat}g | Carbs: ${item.carbohydrates}g | Protein: ${item.protein}g`}
                    </Text>
                </View>
            </View>
            <View>
                <Text style={{ color: kcalColor }}>{item.kcal} kcal</Text>
            </View>
        </View>
    );
}

export default withTheme(FoodItem);

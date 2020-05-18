import Color from 'color';
import { ConsumedDto, NutritionalInfo } from 'Models';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Surface, TouchableRipple, useTheme } from 'react-native-paper';
import selectLabel, { isProductLiquid } from 'src/utils/product-utils';
import { roundNumber } from 'src/utils/string-utils';

type Props = {
    onPress?: () => void;
    onLongPress?: () => void;
    consumed: ConsumedDto;
};

function ConsumedProductItem({ onPress, onLongPress, consumed }: Props) {
    if (consumed.foodPortion.type === 'product') {
        return (
            <FoodPortionItem
                onPress={onPress}
                onLongPress={onLongPress}
                label={selectLabel(consumed.foodPortion.product.label)}
                nutritionalInfo={consumed.foodPortion.nutritionalInfo}
                isLiquid={isProductLiquid(consumed.foodPortion.product)}
            />
        );
    }

    if (consumed.foodPortion.type === 'custom') {
        return (
            <FoodPortionItem
                onPress={onPress}
                onLongPress={onLongPress}
                label={consumed.foodPortion.label || 'Manual food'}
                nutritionalInfo={consumed.foodPortion.nutritionalInfo}
                isLiquid={false}
            />
        );
    }

    return <Text>Unsupported</Text>;
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
                <View style={styles.container}>
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

const styles = StyleSheet.create({
    surface: {
        height: '100%',
        elevation: 1,
    },
    root: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    container: {
        display: 'flex',
        padding: 8,
        flexDirection: 'row',
        marginLeft: 8,
        marginRight: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
    },
    description: {
        fontSize: 12,
    },
    energyText: {
        marginLeft: 16,
    },
    flexFill: {
        flex: 1,
    },
    verticalCenterAlignedRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ConsumedProductItem;

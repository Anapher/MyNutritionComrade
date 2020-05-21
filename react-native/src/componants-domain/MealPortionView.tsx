import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FoodPortionMealDto, FoodPortionItemDto } from 'Models';
import { useTheme } from '@react-navigation/native';
import Color from 'color';
import { Surface, TouchableRipple, Divider } from 'react-native-paper';
import { roundNumber } from 'src/utils/string-utils';
import { styles } from './food-portion-styles';
import { getFoodPortionId } from 'src/utils/different-foods';
import { ProductFoodPortionView, CustomFoodPortionView } from './FoodPortionView';

type Props = {
    onPress?: () => void;
    onLongPress?: () => void;

    onItemPress?: (item: FoodPortionItemDto) => void;
    onItemLongPress?: (item: FoodPortionItemDto) => void;

    meal: FoodPortionMealDto;
};

function MealPortionView({ meal, onPress, onLongPress, onItemPress, onItemLongPress }: Props) {
    const theme = useTheme();

    const rippleColor = 'black';
    const titleColor = Color(theme.colors.text).alpha(0.87).rgb().string();
    const kcalColor = Color(theme.colors.text).alpha(0.8).rgb().string();

    return (
        <Surface style={styles.surface}>
            <View>
                <TouchableRipple
                    onPress={onPress && (() => onPress())}
                    onLongPress={onLongPress && (() => onLongPress())}
                    rippleColor={rippleColor}
                    style={styles.root}
                >
                    <View style={[styles.container]}>
                        <View style={styles.row}>
                            <View style={styles.flexFill}>
                                <Text
                                    ellipsizeMode="tail"
                                    numberOfLines={1}
                                    style={[styles.title, { color: titleColor, fontWeight: 'bold' }]}
                                >
                                    {meal.portion !== 1 ? `${meal.portion}x ` : null}
                                    {meal.mealName}
                                </Text>
                            </View>
                            <Text style={[styles.energyText, { color: kcalColor }]}>
                                {roundNumber(meal.nutritionalInfo.energy)} kcal
                            </Text>
                        </View>
                    </View>
                </TouchableRipple>
                <View style={{ marginLeft: 16 }}>
                    {meal.items.map((x, i) => (
                        <View key={getFoodPortionId(x)}>
                            <Divider style={{ marginLeft: -16 }} />
                            <MealFoodPortionItem
                                onPress={onItemPress && (() => onItemPress(x))}
                                onLongPress={onItemLongPress && (() => onItemLongPress(x))}
                                item={x}
                                lastItem={i === meal.items.length - 1}
                            />
                        </View>
                    ))}
                </View>
            </View>
        </Surface>
    );
}

type MealItemProps = {
    item: FoodPortionItemDto;
    lastItem?: boolean;

    onPress?: () => void;
    onLongPress?: () => void;
};

function MealFoodPortionItem({ item, lastItem, onPress, onLongPress }: MealItemProps) {
    let itemComponent = undefined;
    switch (item.type) {
        case 'product':
            itemComponent = <ProductFoodPortionView foodPortion={item} onPress={onPress} onLongPress={onLongPress} />;
            break;

        case 'custom':
            itemComponent = <CustomFoodPortionView foodPortion={item} onPress={onPress} onLongPress={onLongPress} />;
            break;
    }

    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ display: 'flex', flexDirection: 'column' }}>
                <View style={{ backgroundColor: 'white', width: 1, flex: 1 }}></View>
                <View style={{ backgroundColor: 'white', width: 1, height: 1 }}></View>
                <View style={{ backgroundColor: lastItem ? 'transparent' : 'white', width: 1, flex: 1 }}></View>
            </View>
            <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                <View style={{ backgroundColor: 'white', height: 1, width: 8 }}></View>
            </View>
            <View style={{ flex: 1 }}>{itemComponent}</View>
        </View>
    );
}

export default MealPortionView;

const styles2 = StyleSheet.create({});

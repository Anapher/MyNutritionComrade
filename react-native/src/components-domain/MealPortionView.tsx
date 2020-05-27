import {
    FoodPortionItemDto,
    FoodPortionMealDto,
    FoodPortionDto,
    FoodPortionCreationDto,
    MealFoodPortionCreationDto,
    SuggestionFoodPortionCreationDto,
    FoodPortionSuggestion,
} from 'Models';
import React from 'react';
import { View } from 'react-native';
import { Divider, Surface, TouchableRipple, useTheme, Text } from 'react-native-paper';
import { getFoodPortionId, mapFoodPortionDtoCreationDto } from 'src/utils/different-foods';
import { styles } from './food-portion-styles';
import { CustomFoodPortionView, ProductFoodPortionView } from './FoodPortionView';
import Color from 'color';
import { roundNumber } from 'src/utils/string-utils';
import { suggestionIdToString } from 'src/utils/food-utils';

type FoodOptions<TC extends FoodPortionCreationDto> = (
    executeEdit: (changes: Partial<TC>) => void,
    executeRemove: () => void,
) => void;

type FoodItemOptions<TC extends FoodPortionCreationDto, TItem extends FoodPortionDto> = (
    item: TItem,
    executeEdit: (changes: Partial<TC>) => void,
    executeRemove: () => void,
) => void;

interface Props<T extends FoodPortionDto, TCreation extends FoodPortionCreationDto> {
    onPress?: FoodOptions<TCreation>;
    onLongPress?: FoodOptions<TCreation>;

    onItemPress?: FoodItemOptions<FoodPortionCreationDto, FoodPortionDto>;
    onItemLongPress?: FoodItemOptions<FoodPortionCreationDto, FoodPortionDto>;

    onEdit: (creationDto: TCreation) => void;
    onRemove: () => void;
    createCreationDto: (original: T, changes?: Partial<TCreation>, tree?: FoodPortionCreationDto[]) => TCreation;

    root: T;
    header: React.ReactChild;
    items: FoodPortionDto[];

    dense?: boolean;
}

function MealPortionTree<T extends FoodPortionDto, TC extends FoodPortionCreationDto>({
    onPress,
    onLongPress,
    onItemPress,
    onItemLongPress,
    onEdit,
    createCreationDto,
    root,
    header,
    items,
    onRemove,
    dense,
}: Props<T, TC>) {
    const rippleColor = 'black';

    const onEditDelegate = (changes: Partial<TC>) => onEdit(createCreationDto(root, changes, undefined));

    return (
        <Surface style={styles.surface}>
            <View>
                <TouchableRipple
                    onPress={onPress && (() => onPress(onEditDelegate, onRemove))}
                    onLongPress={onLongPress && (() => onLongPress(onEditDelegate, onRemove))}
                    rippleColor={rippleColor}
                    style={styles.root}
                >
                    <View style={[styles.container, dense && { marginLeft: 0 }]}>{header}</View>
                </TouchableRipple>
                <View style={{ marginLeft: dense ? 8 : 16 }}>
                    {items.map((item, i) => {
                        const onRemoveItem = () => {
                            onEdit(
                                createCreationDto(
                                    root,
                                    undefined,
                                    items.filter((x) => x !== item).map(mapFoodPortionDtoCreationDto),
                                ),
                            );
                        };

                        return (
                            <View key={getFoodPortionId(item)}>
                                <Divider style={{ marginLeft: dense ? -8 : -16 }} />
                                <MealPortionItem
                                    onPress={onItemPress}
                                    onLongPress={onItemLongPress}
                                    onRemove={onRemoveItem}
                                    item={item}
                                    lastItem={i === items.length - 1}
                                    onEdit={(newCreationDto) =>
                                        onEdit({
                                            ...createCreationDto(
                                                root,
                                                undefined,
                                                items.map((x) =>
                                                    item === x ? newCreationDto : mapFoodPortionDtoCreationDto(x),
                                                ),
                                            ),
                                        })
                                    }
                                />
                            </View>
                        );
                    })}
                </View>
            </View>
        </Surface>
    );
}

type MealItemProps = {
    item: FoodPortionDto;
    lastItem?: boolean;

    onPress?: FoodItemOptions<FoodPortionCreationDto, FoodPortionDto>;
    onLongPress?: FoodItemOptions<FoodPortionCreationDto, FoodPortionDto>;

    onEdit: (creationDto: FoodPortionCreationDto) => void;
    onRemove: () => void;
};

function MealPortionItem({ item, lastItem, onPress, onLongPress, onEdit, onRemove }: MealItemProps) {
    let itemComponent = undefined;

    const commonProps = {
        onEdit,
        onRemove,
        onPress: (executeEdit: (changes: Partial<any>) => void, executeRemove: () => void) =>
            onPress && onPress(item, executeEdit, executeRemove),
        onLongPress: (executeEdit: (changes: Partial<any>) => void, executeRemove: () => void) =>
            onLongPress && onLongPress(item, executeEdit, executeRemove),
    };

    switch (item.type) {
        case 'product':
            itemComponent = (
                <ProductFoodPortionView {...commonProps} foodPortion={item} containerStyle={{ marginLeft: 0 }} />
            );
            break;
        case 'custom':
            itemComponent = (
                <CustomFoodPortionView {...commonProps} foodPortion={item} containerStyle={{ marginLeft: 0 }} />
            );
            break;
        case 'meal':
            itemComponent = (
                <MealPortionView
                    foodPortion={item}
                    {...commonProps}
                    onItemPress={onPress}
                    onItemLongPress={onLongPress}
                    dense
                />
            );
            break;
        case 'suggestion':
            throw new Error('Not supported here');
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

interface MealPortionViewProps {
    onPress?: FoodOptions<MealFoodPortionCreationDto>;
    onLongPress?: FoodOptions<MealFoodPortionCreationDto>;

    onItemPress?: FoodItemOptions<FoodPortionCreationDto, FoodPortionItemDto>;
    onItemLongPress?: FoodItemOptions<FoodPortionCreationDto, FoodPortionItemDto>;

    onEdit: (creationDto: MealFoodPortionCreationDto) => void;
    onRemove: () => void;

    foodPortion: FoodPortionMealDto;
    dense?: boolean;
}

function MealPortionView({ foodPortion, onItemPress, onItemLongPress, ...props }: MealPortionViewProps) {
    const theme = useTheme();
    const titleColor = Color(theme.colors.text).alpha(0.87).rgb().string();
    const kcalColor = Color(theme.colors.text).alpha(0.8).rgb().string();

    return (
        <MealPortionTree
            {...props}
            onItemPress={onItemPress as any}
            onItemLongPress={onItemLongPress as any}
            root={foodPortion}
            createCreationDto={(_, changes, tree) => ({
                portion: foodPortion.portion,
                mealId: foodPortion.mealId,
                ...changes,
                type: 'meal',
                overwriteIngredients: tree,
            })}
            items={foodPortion.items}
            header={
                <View style={styles.row}>
                    <View style={styles.flexFill}>
                        <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={[styles.title, { color: titleColor, fontWeight: 'bold' }]}
                        >
                            {foodPortion.portion !== 1 ? `${foodPortion.portion}x ` : null}
                            {foodPortion.mealName}
                        </Text>
                    </View>
                    <Text style={[styles.energyText, { color: kcalColor }]}>
                        {roundNumber(foodPortion.nutritionalInfo.energy)} kcal
                    </Text>
                </View>
            }
        />
    );
}

type SuggestionPortionProps = {
    onPress?: FoodOptions<SuggestionFoodPortionCreationDto>;
    onLongPress?: FoodOptions<SuggestionFoodPortionCreationDto>;

    onItemPress?: FoodItemOptions<FoodPortionCreationDto, FoodPortionDto>;
    onItemLongPress?: FoodItemOptions<FoodPortionCreationDto, FoodPortionDto>;

    onEdit: (creationDto: SuggestionFoodPortionCreationDto) => void;
    onRemove: () => void;

    foodPortion: FoodPortionSuggestion;

    dense?: boolean;
};

export function SuggestionPortionView({ foodPortion, ...props }: SuggestionPortionProps) {
    const theme = useTheme();
    const titleColor = Color(theme.colors.text).alpha(0.87).rgb().string();
    const kcalColor = Color(theme.colors.text).alpha(0.8).rgb().string();

    return (
        <MealPortionTree
            {...props}
            root={foodPortion}
            createCreationDto={(_, changes, tree) => ({
                suggestionId: foodPortion.suggestionId,
                ...changes,
                items: tree || foodPortion.items.map(mapFoodPortionDtoCreationDto),
                type: 'suggestion',
            })}
            items={foodPortion.items}
            header={
                <View style={styles.row}>
                    <View style={styles.flexFill}>
                        <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={[styles.title, { color: titleColor, fontWeight: 'bold' }]}
                        >
                            {suggestionIdToString(foodPortion.suggestionId)}
                        </Text>
                    </View>
                    <Text style={[styles.energyText, { color: kcalColor }]}>
                        {roundNumber(foodPortion.nutritionalInfo.energy)} kcal
                    </Text>
                </View>
            }
        />
    );
}

export default MealPortionView;

import color from 'color';
import _ from 'lodash';
import { ConsumedProduct } from 'Models';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Divider, Subheading, Surface, Text, Theme, TouchableRipple, withTheme } from 'react-native-paper';
import FoodButtons from './FoodButtons';
import FoodItem from './FoodItem';
import { roundNumber } from 'src/utils/string-utils';

const styles = StyleSheet.create({
    surface: {
        width: '100%',
        elevation: 4,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderTopWidth: 4,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        elevation: 14,
    },
    headerText: {
        fontSize: 16,
    },
    footer: {
        elevation: 14,
    },
});

type Props = {
    title: string;
    items: ConsumedProduct[];
    theme: Theme;

    onAddFood: () => void;
    onScanBarcode: () => void;
    onMoreOptions: () => void;
    onItemPress?: (item: ConsumedProduct) => void;
    onItemLongPress?: (item: ConsumedProduct) => void;
};

function FoodList({
    title,
    items,
    onAddFood,
    onScanBarcode,
    onMoreOptions,
    theme,
    onItemPress,
    onItemLongPress,
}: Props) {
    const totalCalories = _.sumBy(items, (x) => x.nutritionalInformation.energy);
    const totalFat = _.sumBy(items, (x) => x.nutritionalInformation.fat);
    const totalCarbohydrates = _.sumBy(items, (x) => x.nutritionalInformation.carbohydrates);
    const totalProtein = _.sumBy(items, (x) => x.nutritionalInformation.protein);
    const totalSugars = _.sumBy(items, (x) => x.nutritionalInformation.sugars);

    const summaryColor = color(theme.colors.text).alpha(0.5).rgb().string();
    const rippleColor = 'black';

    return (
        <Surface style={styles.surface}>
            <Surface style={styles.header}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Subheading accessibilityRole="header" style={styles.headerText}>
                        {title}
                    </Subheading>
                    <Subheading style={styles.headerText}>
                        {roundNumber(totalCalories)}
                        <Text style={{ fontSize: 12 }}> kcal</Text>
                    </Subheading>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                    <Text style={{ fontSize: 11, color: summaryColor }}>{`Fat: ${roundNumber(totalFat)}g`}</Text>
                    <Text style={{ fontSize: 11, color: summaryColor }}>{`Carbohydrates: ${roundNumber(
                        totalCarbohydrates,
                    )}g`}</Text>
                    <Text style={{ fontSize: 11, color: summaryColor }}>{`Sugars: ${roundNumber(totalSugars)}g`}</Text>
                    <Text style={{ fontSize: 11, color: summaryColor }}>{`Protein: ${roundNumber(
                        totalProtein,
                    )}g`}</Text>
                </View>
            </Surface>
            <FlatList
                data={items}
                ItemSeparatorComponent={() => <Divider />}
                keyExtractor={(item) => item.productId}
                renderItem={({ item }) => (
                    <TouchableRipple
                        onPress={onItemPress && (() => onItemPress(item))}
                        onLongPress={onItemLongPress && (() => onItemLongPress(item))}
                        rippleColor={rippleColor}
                    >
                        <FoodItem item={item} />
                    </TouchableRipple>
                )}
            />
            <Surface style={styles.footer}>
                {items.length === 0 && (
                    <View
                        style={{
                            borderBottomColor: 'white',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            marginRight: 80,
                        }}
                    />
                )}
                <FoodButtons onAddFood={onAddFood} onScanBarcode={onScanBarcode} onMoreOptions={onMoreOptions} />
            </Surface>
        </Surface>
    );
}

export default withTheme(FoodList);

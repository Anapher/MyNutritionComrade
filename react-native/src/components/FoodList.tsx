import color from 'color';
import _ from 'lodash';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Divider, Subheading, Surface, Text, Theme, TouchableRipple, withTheme } from 'react-native-paper';
import FoodButtons from './FoodButtons';
import FoodItem, { FoodListItem } from './FoodItem';

const styles = StyleSheet.create({
    surface: {
        width: '100%',
        elevation: 8,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderTopWidth: 4,
    },
    header: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
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
    items: FoodListItem[];
    theme: Theme;

    onAddFood: () => void;
    onScanBarcode: () => void;
    onMoreOptions: () => void;
};

function FoodList({ title, items, onAddFood, onScanBarcode, onMoreOptions, theme }: Props) {
    const totalCalories = _.sumBy(items, x => x.kcal);
    const totalFat = _.sumBy(items, x => x.fat);
    const totalCarbohydrates = _.sumBy(items, x => x.carbohydrates);
    const totalProtein = _.sumBy(items, x => x.protein);
    const totalSugars = _.sumBy(items, x => x.sugars);

    const summaryColor = color(theme.colors.text)
        .alpha(0.5)
        .rgb()
        .string();

    const borderColor = color(theme.colors.surface)
        .rgb(0.8)
        .string();

    return (
        <Surface style={styles.surface}>
            <Surface style={styles.header}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Subheading accessibilityRole="header" style={styles.headerText}>
                        {title}
                    </Subheading>
                    <Subheading style={styles.headerText}>
                        {totalCalories}
                        <Text style={{ fontSize: 12 }}> kcal</Text>
                    </Subheading>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 11, color: summaryColor }}>{`Fat: ${totalFat}g`}</Text>
                    <Text style={{ fontSize: 11, color: summaryColor }}>{`Carbohydrates: ${totalCarbohydrates}g`}</Text>
                    <Text style={{ fontSize: 11, color: summaryColor }}>{`Sugars: ${totalSugars}g`}</Text>
                    <Text style={{ fontSize: 11, color: summaryColor }}>{`Protein: ${totalProtein}g`}</Text>
                </View>
            </Surface>
            <FlatList
                data={items}
                ItemSeparatorComponent={() => <Divider />}
                keyExtractor={item => item.name}
                renderItem={({ item }) => (
                    <TouchableRipple key={item.name} onPress={() => {}} rippleColor={borderColor}>
                        <FoodItem item={item} />
                    </TouchableRipple>
                )}
            />
            <Surface style={styles.footer}>
                <FoodButtons onAddFood={onAddFood} onScanBarcode={onScanBarcode} onMoreOptions={onMoreOptions} />
            </Surface>
        </Surface>
    );
}

export default withTheme(FoodList);

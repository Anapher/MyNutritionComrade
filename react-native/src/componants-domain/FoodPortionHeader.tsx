import Color from 'color';
import { FoodPortionDto } from 'Models';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Subheading, Surface, Text, useTheme } from 'react-native-paper';
import { sumNutritions } from 'src/utils/product-utils';
import { roundNumber } from 'src/utils/string-utils';

type Props = {
    header?: string;
    foodPortions: FoodPortionDto[];
    style?: StyleProp<ViewStyle>;
};

function FoodPortionHeader({ header, foodPortions, style }: Props) {
    const theme = useTheme();
    const summaryColor = Color(theme.colors.onSurface).alpha(0.5).rgb().string();

    const { energy, fat, carbohydrates, sugars, protein } = sumNutritions(foodPortions.map((x) => x.nutritionalInfo));

    return (
        <Surface style={[styles.header, style]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Subheading accessibilityRole="header" style={styles.headerText}>
                    {header}
                </Subheading>
                <Subheading style={styles.headerText}>
                    {roundNumber(energy)}
                    <Text style={{ fontSize: 12 }}> kcal</Text>
                </Subheading>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={{ fontSize: 11, color: summaryColor }}>{`Fat: ${roundNumber(fat)}g`}</Text>
                <Text style={{ fontSize: 11, color: summaryColor }}>{`Carbohydrates: ${roundNumber(
                    carbohydrates,
                )}g`}</Text>
                <Text style={{ fontSize: 11, color: summaryColor }}>{`Sugars: ${roundNumber(sugars)}g`}</Text>
                <Text style={{ fontSize: 11, color: summaryColor }}>{`Protein: ${roundNumber(protein)}g`}</Text>
            </View>
        </Surface>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        elevation: 8,
    },
    headerText: {
        fontSize: 16,
    },
});

export default FoodPortionHeader;

import React from 'react';
import { StyleSheet, View, SectionListData, StyleProp, ViewStyle } from 'react-native';
import { Subheading, useTheme, Surface, Text } from 'react-native-paper';
import { roundNumber } from 'src/utils/string-utils';
import Color from 'color';
import { ConsumptionTime, ConsumedDto } from 'Models';
import { sumNutritions } from 'src/utils/product-utils';

const timeTitles: { [time in ConsumptionTime]: string } = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
};

type Props = {
    section: SectionListData<ConsumedDto>;
    style?: StyleProp<ViewStyle>;
};

function ConsumptionTimeHeader({ section: { data, time }, style }: Props) {
    const theme = useTheme();
    const summaryColor = Color(theme.colors.onSurface).alpha(0.5).rgb().string();

    const { energy, fat, carbohydrates, sugars, protein } = sumNutritions(
        data.map((x) => x.foodPortion.nutritionalInfo),
    );

    return (
        <Surface style={[styles.header, style]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Subheading accessibilityRole="header" style={styles.headerText}>
                    {(timeTitles as any)[time]}
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

export default ConsumptionTimeHeader;

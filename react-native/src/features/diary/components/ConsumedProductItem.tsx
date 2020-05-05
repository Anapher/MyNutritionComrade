import Color from 'color';
import { ConsumedProduct } from 'Models';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Surface, TouchableRipple, useTheme } from 'react-native-paper';
import { TagLiquid } from 'src/consts';
import selectLabel from 'src/utils/product-utils';
import { roundNumber } from 'src/utils/string-utils';

type Props = {
    onPress?: () => void;
    onLongPress?: () => void;
    product: ConsumedProduct;
};

function ConsumedProductItem({ onPress, onLongPress, product }: Props) {
    const theme = useTheme();

    const titleColor = Color(theme.colors.text).alpha(0.87).rgb().string();
    const descriptionColor = Color(theme.colors.text).alpha(0.7).rgb().string();
    const descriptionBColor = Color(theme.colors.text).alpha(0.4).rgb().string();

    const kcalColor = Color(theme.colors.text).alpha(0.8).rgb().string();
    const rippleColor = 'black';

    const { fat, carbohydrates, protein, volume, energy } = product.nutritionalInfo;

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
                            {selectLabel(product.label)}
                        </Text>
                        <View style={styles.verticalCenterAlignedRow}>
                            <Text style={[styles.description, { color: descriptionColor }]}>
                                {volume}
                                {product.tags.includes(TagLiquid) ? 'ml' : 'g'}
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
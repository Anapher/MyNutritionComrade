import Color from 'color';
import { ConsumedProduct } from 'Models';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableRipple, useTheme } from 'react-native-paper';
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
        <TouchableRipple
            onPress={onPress && (() => onPress())}
            onLongPress={onLongPress && (() => onLongPress())}
            rippleColor={rippleColor}
        >
            <View style={styles.container}>
                <View style={{ flexDirection: 'column' }}>
                    <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.title, { color: titleColor }]}>
                        {selectLabel(product.label)}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                <View>
                    <Text style={{ color: kcalColor }}>{roundNumber(energy)} kcal</Text>
                </View>
            </View>
        </TouchableRipple>
    );
}

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

export default ConsumedProductItem;

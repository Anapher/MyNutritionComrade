import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ConsumedProduct, NutritionalInfo } from 'Models';
import { roundNumber } from 'src/utils/string-utils';
import { sumNutritions } from 'src/utils/product-utils';
import { Text } from 'react-native-paper';
import _ from 'lodash';

type TileProps = {
    caption: string;
    value: string;
    text: string;
    fat?: boolean;
};

function Tile({ caption, value, text, fat }: TileProps) {
    return (
        <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', flex: 1 }}>
            <Text style={{ letterSpacing: 0.4, fontSize: 12, opacity: 0.6 }}>{caption}</Text>
            <Text style={{ fontSize: 16, letterSpacing: 0.5, fontWeight: fat !== undefined ? 'bold' : undefined }}>
                {value}
            </Text>
            <Text style={{ fontSize: 10 }}>{text}</Text>
        </View>
    );
}

type NutritionTile = {
    info: NutritionalInfo;
    volume: number;
    name: keyof NutritionalInfo;
};

function NutritionTile({ info, name, volume }: NutritionTile) {
    return (
        <Tile
            caption={((info[name] / (info.volume || 1)) * 100).toFixed(1) + '%'}
            value={roundNumber((info[name] / (info.volume || 1)) * volume) + 'g'}
            text={name.charAt(0).toUpperCase() + name.slice(1)}
        />
    );
}

type Props = {
    products: ConsumedProduct[];
};

function NutritionSummary({ products }: Props) {
    const nutritions = sumNutritions(products.map((x) => x.nutritionalInfo));

    return (
        <View style={styles.root}>
            <Tile caption=" " value={roundNumber(nutritions.energy) as any} text="kcal" fat />
            <NutritionTile volume={nutritions.volume} info={nutritions} name="carbohydrates" />
            <NutritionTile volume={nutritions.volume} info={nutritions} name="fat" />
            <NutritionTile volume={nutritions.volume} info={nutritions} name="protein" />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default NutritionSummary;

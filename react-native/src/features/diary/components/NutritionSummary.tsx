import { NutritionalInfo } from 'Models';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { roundNumber } from 'src/utils/string-utils';
import Tile from './Tile';

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
    nutritions: NutritionalInfo;
};

function NutritionSummary({ nutritions }: Props) {
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

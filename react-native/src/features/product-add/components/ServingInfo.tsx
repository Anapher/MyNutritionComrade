import { NutritionalInfo, ProductSearchDto } from 'Models';
import React from 'react';
import { View } from 'react-native';
import { Text, Title } from 'react-native-paper';
import selectLabel from 'src/utils/product-utils';
import { roundNumber } from 'src/utils/string-utils';

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
            caption={((info[name] / info.volume) * 100).toFixed(1) + '%'}
            value={roundNumber((info[name] / info.volume) * volume) + 'g'}
            text={name.charAt(0).toUpperCase() + name.slice(1)}
        />
    );
}

type Props = {
    product: ProductSearchDto;
    volume: number;
};

export default function ServingInfo({ product: { label, nutritionalInfo }, volume }: Props) {
    return (
        <View>
            {/* <Title>{selectLabel(label)}</Title> */}
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <Tile
                    caption=" "
                    value={roundNumber((nutritionalInfo.energy / nutritionalInfo.volume) * volume) as any}
                    text="kcal"
                    fat
                />
                <NutritionTile volume={volume} info={nutritionalInfo} name="carbohydrates" />
                <NutritionTile volume={volume} info={nutritionalInfo} name="fat" />
                <NutritionTile volume={volume} info={nutritionalInfo} name="protein" />
            </View>
        </View>
    );
}

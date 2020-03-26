import React from 'react';
import { View } from 'react-native';
import FlatButton from 'src/components/FlatButton';
import FlatIconButton from 'src/components/FlatIconButton';

type Props = {
    onAddFood: () => void;
    onScanBarcode: () => void;
    onMoreOptions: () => void;
};

export default function FoodButtons({ onAddFood, onScanBarcode, onMoreOptions }: Props) {
    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 2 }}>
                <FlatButton text="Add Food" icon="plus" onPress={onAddFood} />
            </View>
            <View style={{ flex: 1 }}>
                <FlatButton text="Scan" icon="barcode" onPress={onScanBarcode} />
            </View>
            <View>
                <FlatIconButton
                    icon="dots-horizontal"
                    margin={14}
                    onPress={onMoreOptions}
                    longPressInfo="More options"
                />
            </View>
        </View>
    );
}

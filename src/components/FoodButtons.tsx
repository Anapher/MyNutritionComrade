import React from 'react';
import { View } from 'react-native';
import FlatButton from './FlatButton';
import FlatIconButton from './FlatIconButton';

export default function FoodButtons() {
    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 2 }}>
                <FlatButton text="Add Food" icon="plus" onPress={() => {}} />
            </View>
            <View style={{ flex: 1 }}>
                <FlatButton text="Scan" icon="barcode" onPress={() => {}} />
            </View>
            <View>
                <FlatIconButton icon="dots-horizontal" margin={14} onPress={() => {}} longPressInfo="More options" />
            </View>
        </View>
    );
}

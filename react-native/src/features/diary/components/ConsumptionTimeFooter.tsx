import Color from 'color';
import { ConsumedProduct } from 'Models';
import React from 'react';
import { SectionListData, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';
import FlatButton from 'src/components/FlatButton';
import FlatIconButton from 'src/components/FlatIconButton';

type Props = {
    section: SectionListData<ConsumedProduct>;
    onAddFood: () => void;
    onScanBarcode: () => void;
    onMoreOptions: () => void;
    style?: StyleProp<ViewStyle>;
};

function ConsumptionTimeFooter({ section: { data }, onAddFood, onScanBarcode, onMoreOptions, style }: Props) {
    const theme = useTheme();

    const surfaceColor = Color(theme.colors.surface).lighten(1.8).string();

    return (
        <Surface style={[styles.footer, { backgroundColor: surfaceColor }, style]}>
            {data.length === 0 && (
                <View
                    style={{
                        borderBottomColor: 'white',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        marginRight: 80,
                    }}
                />
            )}
            <View style={styles.row}>
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
        </Surface>
    );
}

export default ConsumptionTimeFooter;

const styles = StyleSheet.create({
    footer: {
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
    },
});

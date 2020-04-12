import Color from 'color';
import { ConsumedProduct } from 'Models';
import React from 'react';
import { SectionListData, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { Surface, useTheme, Divider } from 'react-native-paper';
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
    return (
        <Surface style={[styles.footer, style]}>
            {data.length === 0 && (
                <View
                    style={{
                        borderBottomColor: theme.colors.disabled,
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
        elevation: 8,
    },
    row: {
        flexDirection: 'row',
    },
});

import { ProductProperties } from 'Models';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Subheading, Text } from 'react-native-paper';
import _ from 'lodash';
import { useTheme } from '@react-navigation/native';
import Color from 'color';
import ReadOnlyTable, { ReadOnlyTableRow } from 'src/components/ReadOnlyTable';
import { nutritionalInfo as nutritionalInfoDescription } from 'src/features/product-create/data';
import { formatNumber } from 'src/utils/string-utils';

type Props = {
    product: ProductProperties;
};

function ProductOverview({ product: { label, code, tags, nutritionalInfo, servings, defaultServing } }: Props) {
    const theme = useTheme();
    const secondaryText = Color(theme.colors.text).alpha(0.5).string();

    return (
        <View>
            <Subheading>Labels</Subheading>
            {_.sortBy(label, (x) => x.languageCode).map((x) => (
                <View key={`${x.languageCode}/${x.value}`} style={styles.row}>
                    <Text style={{ color: secondaryText, marginRight: 8 }}>({x.languageCode})</Text>
                    <Text style={styles.flexWrap}>{x.value}</Text>
                </View>
            ))}
            <Subheading style={styles.section}>Nutritional Information</Subheading>
            <ReadOnlyTable>
                {nutritionalInfoDescription.map((x, i) => (
                    <ReadOnlyTableRow
                        showDivider={i > 0}
                        alternate={i % 2 === 1}
                        label={x.label}
                        key={x.name}
                        inset={x.inset}
                    >
                        <Text>{formatNumber(nutritionalInfo[x.name], 2) + x.unit}</Text>
                    </ReadOnlyTableRow>
                ))}
            </ReadOnlyTable>
            <View style={styles.section}>
                <Subheading>Other</Subheading>
                <View style={styles.row}>
                    <Text>Barcode: </Text>
                    {code ? (
                        <Text>{code}</Text>
                    ) : (
                        <Text style={{ color: secondaryText, fontStyle: 'italic' }}>{'<not set>'}</Text>
                    )}
                </View>
                <View style={styles.row}>
                    <Text>Tags: </Text>
                    {tags.length > 0 ? (
                        <Text>{tags.join(', ')}</Text>
                    ) : (
                        <Text style={{ color: secondaryText, fontStyle: 'italic' }}>None</Text>
                    )}
                </View>
            </View>
            <View style={styles.section}>
                <Subheading>Servings</Subheading>
                {Object.keys(servings).map((x) => (
                    <View style={styles.row} key={x}>
                        <Text style={{ width: 64 }}>{x}: </Text>
                        <Text>{servings[x]}</Text>
                        {defaultServing === x && <Text style={{ color: secondaryText, marginLeft: 8 }}>(default)</Text>}
                    </View>
                ))}
            </View>
        </View>
    );
}

export default ProductOverview;

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    section: {
        marginTop: 16,
    },
    fill: {
        flex: 1,
    },
    flexWrap: { flex: 1, flexWrap: 'wrap' },
});

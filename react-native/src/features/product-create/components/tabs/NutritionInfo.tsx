import Color from 'color';
import { FormikProps } from 'formik';
import { ProductProperties } from 'Models';
import React, { useRef } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { Subheading, Surface, Text, useTheme } from 'react-native-paper';
import Row from 'src/components/Row';
import { TagLiquid } from 'src/consts';
import { nutritionalInfo } from '../../data';

type Props = {
    formik: FormikProps<ProductProperties>;
    onShowNextPage: () => void;
};

function NutritionInfo({ formik, onShowNextPage }: Props) {
    const theme = useTheme();

    const dividerColor = Color(theme.colors.onSurface).alpha(0.2).string();
    const textBackground = Color(theme.colors.text).alpha(0.1).string();

    const refs = nutritionalInfo.map(() => useRef<TextInput>(null));
    const { values, setFieldValue, errors } = formik;

    const baseUnit = formik.values.tags.includes(TagLiquid) ? 'ml' : 'g';

    return (
        <FlatList
            ItemSeparatorComponent={() => <View style={{ borderBottomColor: dividerColor, borderBottomWidth: 1 }} />}
            data={nutritionalInfo}
            stickyHeaderIndices={[0]}
            keyExtractor={(item) => item.name}
            ListHeaderComponent={
                <Surface style={styles.listHeader}>
                    <Row
                        name={<Subheading>Nutritional Information</Subheading>}
                        lastItem
                        error={errors.nutritionalInfo?.volume}
                    >
                        <Subheading>{`Ø/100${baseUnit}`}</Subheading>
                    </Row>
                </Surface>
            }
            renderItem={({ item, index }) => (
                <Row
                    key={item.name}
                    name={<Text style={item.inset && styles.insetText}>{item.label}</Text>}
                    lastItem
                    error={errors.nutritionalInfo && errors.nutritionalInfo[item.name]}
                >
                    <View style={styles.rightAlignedRow}>
                        <TextInput
                            ref={refs[index]}
                            style={{
                                paddingHorizontal: 8,
                                backgroundColor: textBackground,
                                color: theme.colors.text,
                                width: 60,
                            }}
                            keyboardType="numeric"
                            returnKeyType="next"
                            value={values.nutritionalInfo[item.name].toString()}
                            blurOnSubmit={false}
                            selectTextOnFocus
                            onChangeText={(s) => {
                                setFieldValue(`nutritionalInfo.${item.name}`, s.replace(',', '.'));
                            }}
                            onSubmitEditing={() => {
                                if (index < refs.length - 1) {
                                    refs[index + 1].current?.focus();
                                } else {
                                    onShowNextPage();
                                }
                            }}
                        />
                        <Text style={styles.unitText}> {item.unit}</Text>
                    </View>
                </Row>
            )}
        ></FlatList>
    );
}

const styles = StyleSheet.create({
    listHeader: {
        elevation: 1,
    },
    rightAlignedRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    unitText: {
        marginBottom: 4,
        width: 32,
    },
    insetText: {
        marginLeft: 16,
    },
});

export default NutritionInfo;

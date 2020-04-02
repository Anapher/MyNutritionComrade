import Color from 'color';
import { FormikProps } from 'formik';
import { NutritionalInformation, ProductInfo } from 'Models';
import React, { useRef } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import { Subheading, Surface, Text, Theme, withTheme } from 'react-native-paper';
import Row from 'src/components/Row';
import { TagLiquid } from 'src/consts';
import { nutritionalInfo } from '../data';

type Props = {
    formik: FormikProps<ProductInfo>;
    theme: Theme;
    onShowNextPage: () => void;
};

function NutritionInfo({ formik, theme, onShowNextPage }: Props) {
    const dividerColor = Color(theme.colors.text).alpha(0.5).string();
    const background = Color(theme.colors.accent).alpha(0.3).string();

    const refs = nutritionalInfo.map(() => useRef<TextInput>(null));
    const { values, setFieldValue, errors } = formik;

    return (
        <FlatList
            scrollEnabled
            ItemSeparatorComponent={() => <View style={{ borderBottomColor: dividerColor, borderBottomWidth: 1 }} />}
            data={nutritionalInfo}
            stickyHeaderIndices={[0]}
            keyExtractor={(item) => item.name}
            ListHeaderComponent={
                <Surface style={{ elevation: 14 }}>
                    <Row
                        name={<Subheading>Nutrition Facts</Subheading>}
                        lastItem
                        error={errors.nutritionalInformation?.volume}
                    >
                        <Subheading>{`Ø/100${formik.values.tags.includes(TagLiquid) ? 'ml' : 'g'}`}</Subheading>
                    </Row>
                </Surface>
            }
            renderItem={({ item, index }) => (
                <Row
                    key={item.name}
                    name={<Text>{item.label}</Text>}
                    lastItem
                    error={errors.nutritionalInformation && errors.nutritionalInformation[item.name]}
                >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                        <TextInput
                            ref={refs[index]}
                            style={{
                                paddingHorizontal: 8,
                                backgroundColor: background,
                                color: theme.colors.text,
                                width: 60,
                            }}
                            keyboardType="numeric"
                            returnKeyType="next"
                            value={values.nutritionalInformation[item.name].toString()}
                            blurOnSubmit={false}
                            selectTextOnFocus
                            onChangeText={(s) =>
                                !Number.isNaN(Number(s)) &&
                                setFieldValue(`nutritionalInformation.${item.name}`, Number(s))
                            }
                            onSubmitEditing={() => {
                                if (index < refs.length - 1) {
                                    refs[index + 1].current?.focus();
                                } else {
                                    onShowNextPage();
                                }
                            }}
                        />
                        <Text style={{ marginBottom: 4, width: 32 }}> {item.unit}</Text>
                    </View>
                </Row>
            )}
        ></FlatList>
    );
}

export default withTheme(NutritionInfo);

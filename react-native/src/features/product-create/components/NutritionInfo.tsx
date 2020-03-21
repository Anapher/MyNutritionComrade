import Color from 'color';
import { FormikProps } from 'formik';
import { ProductInfo } from 'Models';
import React, { useRef } from 'react';
import { KeyboardAvoidingView, TextInput, View, Keyboard } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Subheading, Surface, Text, Theme, withTheme } from 'react-native-paper';
import Row from 'src/components/Row';
import { TagLiquid } from 'src/consts';

type Props = {
    formik: FormikProps<ProductInfo>;
    theme: Theme;
    onShowNextPage: () => void;
};

const nutritionInfo = ['energy', 'fat', 'saturatedFat', 'carbohydrates', 'sugars', 'protein', 'dietaryFiber', 'sodium'];

type NutritionRowProps = {
    name: string;
    theme: Theme;
};

function NutritionValue({ name, theme }: NutritionRowProps) {
    const background = Color(theme.colors.accent)
        .alpha(0.3)
        .string();

    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
            <TextInput
                style={{ backgroundColor: background, color: theme.colors.text, width: 60 }}
                keyboardType="numeric"
                returnKeyType="next"
            />
            <Text style={{ marginBottom: 4 }}> g</Text>
        </View>
    );
}

function NutritionInfo({ formik, theme, onShowNextPage }: Props) {
    const dividerColor = Color(theme.colors.text)
        .alpha(0.5)
        .string();

    const background = Color(theme.colors.accent)
        .alpha(0.3)
        .string();

    const refs = nutritionInfo.map(x => useRef<TextInput>(null));

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
            behavior="padding"
            enabled
            keyboardVerticalOffset={80}
        >
            <FlatList
                scrollEnabled
                ItemSeparatorComponent={() => (
                    <View style={{ borderBottomColor: dividerColor, borderBottomWidth: 1 }} />
                )}
                data={nutritionInfo}
                stickyHeaderIndices={[0]}
                keyExtractor={item => item}
                ListHeaderComponent={
                    <Surface style={{ elevation: 14 }}>
                        <Row name={<Subheading>Nutrition Facts</Subheading>} lastItem>
                            <Subheading>{`Ø/100${formik.values.tags.includes(TagLiquid) ? 'ml' : 'g'}`}</Subheading>
                        </Row>
                    </Surface>
                }
                renderItem={({ item, index }) => (
                    <Row key={item} name={<Text>{item}</Text>} lastItem>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                            <TextInput
                                ref={refs[index]}
                                style={{ backgroundColor: background, color: theme.colors.text, width: 60 }}
                                keyboardType="numeric"
                                returnKeyType="next"
                                blurOnSubmit={false}
                                selectTextOnFocus
                                onSubmitEditing={() => {
                                    if (index < refs.length - 1) {
                                        refs[index + 1].current?.focus();
                                    } else {
                                        onShowNextPage();
                                    }
                                }}
                            />
                            <Text style={{ marginBottom: 4 }}> g</Text>
                        </View>
                    </Row>
                )}
            ></FlatList>
        </KeyboardAvoidingView>
    );
}

export default withTheme(NutritionInfo);

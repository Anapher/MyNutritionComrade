import Color from 'color';
import { FormikProps } from 'formik';
import { ProductInfo } from 'Models';
import React, { useRef } from 'react';
import { SectionList, SectionListData, TextInput, View } from 'react-native';
import { Subheading, Surface, Text, Theme } from 'react-native-paper';
import CheckableRow from 'src/components/CheckableRow';
import Row from 'src/components/Row';
import { TagLiquid } from 'src/consts';
import { getServings, ServingInfo } from '../data';

const servingsFactory: (isLiquid: boolean) => SectionListData<ServingInfo>[] = (isLiquid) => {
    const servings = getServings(isLiquid);

    return [
        {
            title: 'Product',
            data: [servings.package, servings.portion],
        },
        {
            title: 'Kitchen Measurements',
            data: [servings.cup, servings.el, servings.tl],
        },
        {
            title: 'Applications',
            data: [servings.slice, servings.piece, servings.bread],
        },
        {
            title: 'Quantities',
            data: [servings.small, servings.medium, servings.large, servings.extraLarge],
        },
    ];
};

type Props = {
    formik: FormikProps<ProductInfo>;
    theme: Theme;
};

export default function Servings({ formik: { values, setFieldValue, errors }, theme }: Props) {
    const dividerColor = Color(theme.colors.text).alpha(0.5).string();
    const background = Color(theme.colors.accent).alpha(0.3).string();

    const isLiquid = values.tags.includes(TagLiquid);
    const servings = servingsFactory(isLiquid);
    const baseUnit = isLiquid ? 'ml' : 'g';

    const flattendServings = servings.reduce<ServingInfo[]>((a, b) => a.concat(b.data), []);
    const refs = flattendServings.map((x) => ({ id: x.id, ref: useRef<TextInput>(null) }));

    return (
        <SectionList
            sections={servings}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{ borderBottomColor: dividerColor, borderBottomWidth: 1 }} />}
            renderSectionHeader={({ section: { title } }) => (
                <Surface style={{ elevation: 14 }}>
                    <Row name={<Subheading>{title}</Subheading>} lastItem />
                </Surface>
            )}
            ListHeaderComponent={
                <CheckableRow
                    checked={values.defaultServing === baseUnit}
                    onPress={() => setFieldValue('defaultServing', baseUnit)}
                    lastItem
                    description="Please check the default serving portion."
                    name={<Text>Base unit</Text>}
                >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Text>1</Text>
                        <Text style={{ width: 32 }}> {baseUnit}</Text>
                    </View>
                </CheckableRow>
            }
            renderItem={({ item }) => (
                <CheckableRow
                    disabled={item.predefinedValue !== undefined}
                    checked={values.defaultServing === item.id}
                    onPress={() => setFieldValue('defaultServing', item.id)}
                    name={<Text>{item.label}</Text>}
                    lastItem
                    description={item.description}
                    error={
                        (errors.servings && errors.servings[item.id]) ||
                        (values.defaultServing === item.id && errors.defaultServing ? errors.defaultServing : undefined)
                    }
                >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                        <TextInput
                            ref={refs.find((x) => x.id === item.id)!.ref}
                            style={{
                                paddingHorizontal: 8,
                                backgroundColor: background,
                                color: theme.colors.text,
                                width: 60,
                                opacity: item.predefinedValue === undefined ? 1 : 0.5,
                            }}
                            keyboardType="numeric"
                            returnKeyType="next"
                            value={(item.predefinedValue === undefined
                                ? values.servings[item.id]
                                : item.predefinedValue
                            )?.toString()}
                            blurOnSubmit={false}
                            selectTextOnFocus
                            editable={item.predefinedValue === undefined}
                            onChangeText={(s) =>
                                s
                                    ? setFieldValue('servings', { ...values.servings, [item.id]: Number(s) })
                                    : setFieldValue(
                                          'servings',
                                          Object.fromEntries(
                                              Object.keys(values.servings)
                                                  .filter((x) => x !== item.id)
                                                  .map((x) => [x, values.servings[x]]),
                                          ),
                                      )
                            }
                            onSubmitEditing={() => {
                                const i = refs.findIndex((x) => x.id === item.id);
                                if (i < refs.length - 1) {
                                    refs[i + 1].ref.current?.focus();
                                }
                            }}
                        />
                        <Text style={{ marginBottom: 4, width: 32 }}> {baseUnit}</Text>
                    </View>
                </CheckableRow>
            )}
        />
    );
}

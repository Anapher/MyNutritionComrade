import React, { useRef } from 'react';
import { FlatList, SectionList, SectionListData, View, TextInput } from 'react-native';
import { Surface, Subheading, Text, Theme, Caption } from 'react-native-paper';
import Row from 'src/components/Row';
import { FormikProps } from 'formik';
import { ProductInfo } from 'Models';
import Color from 'color';
import { TagLiquid } from 'src/consts';

type Props = {
    formik: FormikProps<ProductInfo>;
    theme: Theme;
};

type ServingInfo = {
    id: string;
    label: string;
    description: string;
    setValue?: number;
};

const servingsFactory: (isLiquid: boolean) => SectionListData<ServingInfo>[] = isLiquid => [
    {
        title: 'Product',
        data: [
            {
                id: 'package',
                label: isLiquid ? 'Bottle' : 'Package',
                description: `The size of the ${isLiquid ? 'bottle' : 'package'} when you buy the product.`,
            },
            { id: 'portion', label: 'Portion', description: 'One suggested portition.' },
        ],
    },
    {
        title: 'Kitchen Measurements',
        data: [
            {
                id: 'cup',
                label: 'Cup',
                description: 'One Cup (225ml) of the product.',
                setValue: isLiquid ? 225 : undefined,
            },
            {
                id: 'el',
                label: 'Table Spoon',
                description: 'One table spoon (15ml) of the product.',
                setValue: isLiquid ? 15 : undefined,
            },
            {
                id: 'tl',
                label: 'Tea Spoon',
                description: 'One tea spoon (5ml) of the product.',
                setValue: isLiquid ? 5 : undefined,
            },
        ],
    },
    {
        title: 'Applications',
        data: [
            {
                id: 'slice',
                label: 'Slice',
                description: 'One slice of the product (e. g. applicable for sliced cheese)',
                setValue: isLiquid ? 0 : undefined,
            },
            {
                id: 'piece',
                label: 'Piece',
                description: 'One piece of the product (e. g. applicable for gummy bears)',
                setValue: isLiquid ? 0 : undefined,
            },
            {
                id: 'bread',
                label: 'Bread',
                description:
                    'How much you use when you eat one bread with this product (e. g. applicable for cream cheese).',
                setValue: isLiquid ? 0 : undefined,
            },
        ],
    },
    {
        title: 'Quantities',
        data: [
            {
                id: 'small',
                label: 'Small',
                description: 'One small unit of this product (e. g. one small potato)',
                setValue: isLiquid ? 30 : undefined,
            },
            {
                id: 'medium',
                label: 'Medium',
                description: 'One small unit of this product (e. g. one M egg)',
                setValue: isLiquid ? 250 : undefined,
            },
            {
                id: 'large',
                label: 'Large',
                description: 'One small unit of this product (e. g. one L egg)',
                setValue: isLiquid ? 400 : undefined,
            },
            {
                id: 'extraLarge',
                label: 'Extra Large',
                description: 'One small unit of this product (e. g. one XL egg)',
                setValue: isLiquid ? 500 : undefined,
            },
        ],
    },
];

export default function Servings({ formik: { values, setFieldValue, errors }, theme }: Props) {
    const dividerColor = Color(theme.colors.text)
        .alpha(0.5)
        .string();

    const background = Color(theme.colors.accent)
        .alpha(0.3)
        .string();

    const isLiquid = values.tags.includes(TagLiquid);
    const servings = servingsFactory(isLiquid);

    const flattendServings = servings.reduce<ServingInfo[]>((a, b) => a.concat(b.data), []);
    const refs = flattendServings.map(x => ({ id: x.id, ref: useRef<TextInput>(null) }));

    return (
        <SectionList
            sections={servings}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={{ borderBottomColor: dividerColor, borderBottomWidth: 1 }} />}
            renderSectionHeader={({ section: { title } }) => (
                <Surface style={{ elevation: 14 }}>
                    <Row name={<Subheading>{title}</Subheading>} lastItem />
                </Surface>
            )}
            renderItem={({ item }) => (
                <Row
                    name={<Text>{item.label}</Text>}
                    lastItem
                    description={item.description}
                    error={errors.servings && errors.servings[item.id]}
                >
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
                        <TextInput
                            ref={refs.find(x => x.id === item.id)!.ref}
                            style={{
                                paddingHorizontal: 8,
                                backgroundColor: background,
                                color: theme.colors.text,
                                width: 60,
                                opacity: item.setValue === undefined ? 1 : 0.5,
                            }}
                            keyboardType="numeric"
                            returnKeyType="next"
                            value={(item.setValue === undefined ? values.servings[item.id] : item.setValue)?.toString()}
                            blurOnSubmit={false}
                            selectTextOnFocus
                            editable={item.setValue === undefined}
                            onChangeText={s =>
                                s
                                    ? setFieldValue('servings', { ...values.servings, [item.id]: Number(s) })
                                    : setFieldValue(
                                          'servings',
                                          Object.fromEntries(
                                              Object.keys(values.servings)
                                                  .filter(x => x !== item.id)
                                                  .map(x => [x, values.servings[x]]),
                                          ),
                                      )
                            }
                            onSubmitEditing={() => {
                                const i = refs.findIndex(x => x.id === item.id);
                                if (i < refs.length - 1) {
                                    refs[i + 1].ref.current?.focus();
                                }
                            }}
                        />
                        <Text style={{ marginBottom: 4, width: 32 }}> {isLiquid ? 'ml' : 'g'}</Text>
                    </View>
                </Row>
            )}
        />
    );
}

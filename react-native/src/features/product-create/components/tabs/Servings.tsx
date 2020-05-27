import Color from 'color';
import { FormikProps } from 'formik';
import { ProductProperties } from 'Models';
import React, { useRef } from 'react';
import {
    SectionListData,
    StyleSheet,
    TextInput,
    View,
    SectionList,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view';
import { Subheading, Surface, Text, useTheme } from 'react-native-paper';
import CheckableRow from 'src/components/CheckableRow';
import Row from 'src/components/Row';
import { TagLiquid } from 'src/consts';
import { getServings, ServingInfo } from '../../data';
import NullableNumberTextInput from './NullableNumberTextInput';
import WorkingKeyboardAvoidingView from 'src/components/WorkingKeyboardAvoidingView';

const servingsFactory: (isLiquid: boolean) => SectionListData<ServingInfo>[] = (isLiquid) => {
    const servings = getServings(isLiquid);

    return [
        {
            title: 'Product',
            data: [servings.package, servings.portion],
        },
        {
            title: 'Kitchen Measurements',
            data: [servings.cup, servings.te, servings.ts],
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
    formik: FormikProps<ProductProperties>;
};

function Servings({ formik: { values, setFieldValue, errors } }: Props) {
    const theme = useTheme();
    const dividerColor = Color(theme.colors.text).alpha(0.2).string();
    const textBackground = Color(theme.colors.text).alpha(0.1).string();

    const isLiquid = values.tags.includes(TagLiquid);
    const servings = servingsFactory(isLiquid);
    const baseUnit = isLiquid ? 'ml' : 'g';

    const flattendServings = servings.reduce<ServingInfo[]>((a, b) => a.concat(b.data), []);
    const refs = flattendServings.map((x) => ({ id: x.id, ref: useRef<TextInput>(null) }));

    return (
        <WorkingKeyboardAvoidingView>
            <SectionList
                sections={servings}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => (
                    <View style={{ borderBottomColor: dividerColor, borderBottomWidth: 1 }} />
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Surface style={styles.listHeader}>
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
                        <View style={styles.rightAlignedRow}>
                            <Text>1</Text>
                            <Text style={[styles.unitText, { marginBottom: 0 }]}> {baseUnit}</Text>
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
                            (values.defaultServing === item.id && errors.defaultServing
                                ? errors.defaultServing
                                : undefined)
                        }
                    >
                        <View style={styles.rightAlignedRow}>
                            <NullableNumberTextInput
                                ref={refs.find((x) => x.id === item.id)!.ref}
                                style={{
                                    paddingHorizontal: 8,
                                    backgroundColor: textBackground,
                                    color: theme.colors.text,
                                    width: 60,
                                    opacity: item.predefinedValue === undefined ? 1 : 0.5,
                                    height: 35,
                                }}
                                returnKeyType="next"
                                value={
                                    item.predefinedValue === undefined ? values.servings[item.id] : item.predefinedValue
                                }
                                blurOnSubmit={false}
                                selectTextOnFocus
                                editable={item.predefinedValue === undefined}
                                onChangeValue={(value) => {
                                    console.log(value);

                                    value !== undefined
                                        ? setFieldValue('servings', {
                                              ...values.servings,
                                              [item.id]: value,
                                          })
                                        : setFieldValue(
                                              'servings',
                                              Object.fromEntries(
                                                  Object.keys(values.servings)
                                                      .filter((x) => x !== item.id)
                                                      .map((x) => [x, values.servings[x]]),
                                              ),
                                          );
                                }}
                                onSubmitEditing={() => {
                                    const i = refs.findIndex((x) => x.id === item.id);
                                    if (i < refs.length - 1) {
                                        refs[i + 1].ref.current?.focus();
                                    }
                                }}
                            />
                            <Text style={styles.unitText}> {baseUnit}</Text>
                        </View>
                    </CheckableRow>
                )}
            />
        </WorkingKeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    listHeader: {
        elevation: 2,
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
});

export default Servings;

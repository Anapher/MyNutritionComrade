import { FormikProps } from 'formik';
import { ProductInfo } from 'Models';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import TextToggleButton from 'src/components/TextToggleButton';
import { TagLiquid } from 'src/consts';

type Props = {
    formik: FormikProps<ProductInfo>;
};

export default function DefaultUnit({ formik }: Props) {
    const { values, setValues } = formik;

    return (
        <View>
            <Text>Unit</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <TextToggleButton
                    isChecked={!values.tags.includes(TagLiquid)}
                    isLeft
                    onToggle={() =>
                        setValues({
                            ...values,
                            tags: values.tags.filter((x) => x !== TagLiquid),
                            defaultServing: 'g',
                            servings: Object.fromEntries(
                                Object.keys(values.servings).map((x) =>
                                    x === 'ml' ? ['g', 1] : [x, values.servings[x]],
                                ),
                            ),
                        })
                    }
                    style={{ width: 96 }}
                >
                    <Text>g</Text>
                </TextToggleButton>
                <TextToggleButton
                    label="ml"
                    isChecked={values.tags.includes(TagLiquid)}
                    isRight
                    onToggle={() =>
                        setValues({
                            ...values,
                            tags: [...values.tags, TagLiquid],
                            defaultServing: 'ml',
                            servings: Object.fromEntries(
                                Object.keys(values.servings).map((x) =>
                                    x === 'g' ? ['ml', 1] : [x, values.servings[x]],
                                ),
                            ),
                        })
                    }
                    style={{ marginLeft: 2, width: 96 }}
                >
                    <Text>ml</Text>
                </TextToggleButton>
            </View>
        </View>
    );
}

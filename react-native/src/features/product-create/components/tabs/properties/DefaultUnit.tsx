import { FormikProps } from 'formik';
import { ProductInfo } from 'Models';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import TextToggleButton from 'src/components/TextToggleButton';
import { TagLiquid } from 'src/consts';
import { getServings, ServingInfo } from 'src/features/product-create/data';

type Props = {
    formik: FormikProps<ProductInfo>;
};

function DefaultUnit({ formik }: Props) {
    const { values, setValues } = formik;

    const isLiquid = values.tags.includes(TagLiquid);

    const makeLiquid = () => {
        const servingInfo = getServings(true) as { [key: string]: ServingInfo };
        setValues({
            ...values,
            tags: [...values.tags, TagLiquid],
            defaultServing: 'ml',
            servings: Object.fromEntries(
                Object.keys(values.servings)
                    .filter((x) => servingInfo[x]?.predefinedValue === undefined)
                    .map((x) => (x === 'g' ? ['ml', 1] : [x, values.servings[x]])),
            ),
        });
    };

    const makeSolid = () =>
        setValues({
            ...values,
            tags: values.tags.filter((x) => x !== TagLiquid),
            defaultServing: 'g',
            servings: Object.fromEntries(
                Object.keys(values.servings).map((x) => (x === 'ml' ? ['g', 1] : [x, values.servings[x]])),
            ),
        });

    return (
        <View>
            <Text>Unit</Text>
            <View style={styles.container}>
                <TextToggleButton isChecked={!isLiquid} isLeft onToggle={makeSolid} style={styles.toggleButton}>
                    <Text>g</Text>
                </TextToggleButton>
                <TextToggleButton
                    isChecked={isLiquid}
                    isRight
                    onToggle={makeLiquid}
                    style={[styles.toggleButton, styles.toggleButtonRight]}
                >
                    <Text>ml</Text>
                </TextToggleButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    toggleButton: {
        width: 96,
    },
    toggleButtonRight: {
        marginLeft: 2,
    },
});

export default DefaultUnit;

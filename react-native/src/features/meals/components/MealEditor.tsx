import { StackNavigationProp } from '@react-navigation/stack';
import { Formik, FormikHelpers } from 'formik';
import { CreateMealDto, ProductInfo } from 'Models';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, TextInput, FAB } from 'react-native-paper';
import { RootStackParamList } from 'src/RootNavigator';
import MealEditorHeader from './MealEditorHeader';

const defaultValues: CreateMealDto = {
    name: '',
    products: [],
};

type Props = {
    initialValue?: Partial<CreateMealDto>;

    onSubmit: (values: CreateMealDto, formikHelpers: FormikHelpers<CreateMealDto>) => void | Promise<any>;

    productInfos: ProductInfo[];
    requestProducts: (ids: string[]) => void;

    navigation: StackNavigationProp<RootStackParamList>;
};

function MealEditor({ initialValue, navigation, onSubmit, productInfos, requestProducts }: Props) {
    return (
        <Formik initialValues={{ ...defaultValues, ...initialValue }} onSubmit={onSubmit}>
            {({ isValid, submitForm, values, isSubmitting, setFieldValue }) => {
                React.useLayoutEffect(() => {
                    navigation.setOptions({
                        header: () => (
                            <MealEditorHeader
                                title={values.name}
                                canSubmit={!isSubmitting && isValid}
                                onSubmit={submitForm}
                            />
                        ),
                    });
                });

                return (
                    <View style={styles.root}>
                        <TextInput label="Name" value={values.name} onChangeText={(x) => setFieldValue('name', x)} />
                        <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate('AddProduct')} />
                    </View>
                );
            }}
        </Formik>
    );
}

export default MealEditor;

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

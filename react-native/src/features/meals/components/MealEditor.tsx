import { StackNavigationProp } from '@react-navigation/stack';
import { Formik, FormikHelpers } from 'formik';
import { FoodPortionCreationDto, FoodPortionDto, Meal, MealCreationForm, ProductInfo } from 'Models';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FAB, TextInput } from 'react-native-paper';
import FoodPortionHeader from 'src/componants-domain/FoodPortionHeader';
import FoodPortionView from 'src/componants-domain/FoodPortionView';
import { RootStackParamList } from 'src/RootNavigator';
import { addFoodPortions, createMealPortionFromCreation, getFoodPortionId } from 'src/utils/different-foods';
import MealEditorHeader from './MealEditorHeader';

const defaultValues: MealCreationForm = {
    name: '',
    items: [],
};

type Props = {
    allMeals: Meal[];
    initialValue?: Partial<MealCreationForm>;

    onSubmit: (values: MealCreationForm, formikHelpers: FormikHelpers<MealCreationForm>) => void | Promise<any>;

    navigation: StackNavigationProp<RootStackParamList>;
};

function MealEditor({ initialValue, navigation, onSubmit, allMeals }: Props) {
    const getFoodPortionDto = (creationDto: FoodPortionCreationDto, foodPortion?: FoodPortionDto): FoodPortionDto => {
        if (foodPortion !== undefined) return foodPortion;

        if (creationDto.type === 'meal') {
            const meal = allMeals.find((x) => x.id === creationDto.mealId)!;
            return createMealPortionFromCreation(creationDto, meal);
        }

        throw 'Unknwon ';
    };

    return (
        <Formik<MealCreationForm> initialValues={{ ...defaultValues, ...initialValue }} onSubmit={onSubmit}>
            {({ isValid, submitForm, values, isSubmitting, setFieldValue, setValues }) => {
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
                        <FoodPortionHeader foodPortions={values.items} header="Items" style={styles.itemsHeading} />
                        <FlatList
                            style={styles.list}
                            data={values.items}
                            renderItem={({ item }) => (
                                <FoodPortionView foodPortion={item} onLongPress={() => {}} onPress={() => {}} />
                            )}
                            keyExtractor={(item) => getFoodPortionId(item)}
                        />
                        <FAB
                            style={styles.fab}
                            icon="plus"
                            onPress={() =>
                                navigation.push('SearchProduct', {
                                    config: { disableMealCreation: true },
                                    onCreated: (creationDto, portionDto) => {
                                        const newFoodPortion = getFoodPortionDto(creationDto, portionDto);

                                        const existing = values.items.find(
                                            (x) => getFoodPortionId(x) === getFoodPortionId(newFoodPortion),
                                        );

                                        if (!existing) {
                                            setValues({
                                                ...values,
                                                items: [...values.items, newFoodPortion],
                                            });
                                        } else {
                                            const mergedFoodPortion = addFoodPortions(newFoodPortion, existing);
                                            setValues({
                                                ...values,
                                                items: values.items.map((x) =>
                                                    x === existing ? mergedFoodPortion : x,
                                                ),
                                            });
                                        }
                                    },
                                })
                            }
                        />
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
        display: 'flex',
        flexDirection: 'column',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    list: {
        flex: 1,
    },
    itemsHeading: {
        marginTop: 16,
    },
});

import { StackNavigationProp } from '@react-navigation/stack';
import { Formik, FormikHelpers } from 'formik';
import {
    FoodPortionCreationDto,
    FoodPortionDto,
    FoodPortionMealDto,
    Meal,
    MealCreationForm,
    FoodPortionProductDto,
} from 'Models';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View, ToastAndroid } from 'react-native';
import { Dialog, Divider, FAB, Paragraph, Portal, TextInput } from 'react-native-paper';
import FoodPortionHeader from 'src/components-domain/FoodPortionHeader';
import { CustomFoodPortionView, ProductFoodPortionView } from 'src/components-domain/FoodPortionView';
import MealPortionReadOnlyView from 'src/components-domain/MealPortionReadOnlyView';
import DialogButton from 'src/components/DialogButton';
import { RootStackParamList } from 'src/RootNavigator';
import {
    addFoodPortions,
    createMealPortionFromCreation,
    createProductPortionFromCreation,
    getFoodPortionId,
    getCreationDtoId,
    mapFoodPortionMealDtoToMealInfo,
} from 'src/utils/different-foods';
import * as yup from 'yup';
import MealEditorHeader from './MealEditorHeader';
import { CreateEditProductDelegate, CreateEditMealDelegate } from 'src/components-domain/food-portion-edit-helper';

const defaultValues: MealCreationForm = {
    name: '',
    items: [],
};

type Props = {
    mealId?: string;
    allMeals: Meal[];
    initialValue?: Partial<MealCreationForm>;

    onSubmit: (values: MealCreationForm, formikHelpers: FormikHelpers<MealCreationForm>) => void | Promise<any>;

    navigation: StackNavigationProp<RootStackParamList>;
};

const schema = yup.object().shape({
    name: yup.string().required(),
    items: yup.array().required(),
});

function MealEditor({ initialValue, navigation, onSubmit, allMeals, mealId }: Props) {
    const getFoodPortionDto = (creationDto: FoodPortionCreationDto, foodPortion?: FoodPortionDto): FoodPortionDto => {
        if (foodPortion !== undefined) return foodPortion;

        if (creationDto.type === 'meal') {
            const meal = allMeals.find((x) => x.id === creationDto.mealId)!;
            return createMealPortionFromCreation(creationDto, meal);
        }

        throw new Error(`Cannot create food portion dto from ${creationDto.type}`);
    };

    return (
        <Formik<MealCreationForm>
            initialValues={{ ...defaultValues, ...initialValue }}
            validationSchema={schema}
            onSubmit={onSubmit}
        >
            {({ isValid, submitForm, values, isSubmitting, setFieldValue, setValues }) => {
                React.useLayoutEffect(() => {
                    navigation.setOptions({
                        header: () => (
                            <MealEditorHeader
                                onGoBack={navigation.goBack}
                                title={values.name}
                                canSubmit={!isSubmitting && isValid}
                                onSubmit={submitForm}
                            />
                        ),
                    });
                });

                const [appendMeal, setAppendMeal] = useState<FoodPortionMealDto | undefined>();
                const [optionsFoodPortion, setOptionsFoodPortion] = useState<FoodPortionDto | undefined>();

                const appendFood = (foodPortion: FoodPortionDto) => {
                    if (foodPortion.type === 'meal' && foodPortion.mealId === mealId) {
                        ToastAndroid.show(
                            'Cannot add this meal to itself. That would create an infinite loop and that would be bad...',
                            ToastAndroid.LONG,
                        );
                        return;
                    }

                    if (foodPortion.type === 'suggestion') {
                        foodPortion.items.forEach(appendFood);
                        return;
                    }

                    const existing = values.items.find((x) => getFoodPortionId(x) === getFoodPortionId(foodPortion));

                    if (!existing) {
                        setValues({
                            ...values,
                            items: [...values.items, foodPortion],
                        });
                    } else {
                        const mergedFoodPortion = addFoodPortions(foodPortion, existing);
                        setValues({
                            ...values,
                            items: values.items.map((x) => (x === existing ? mergedFoodPortion : x)),
                        });
                    }
                };

                const removeItem = (foodPortion: FoodPortionDto) => {
                    setValues({ ...values, items: values.items.filter((x) => x !== foodPortion) });
                };

                const onEdit = (creationDto: FoodPortionCreationDto) => {
                    let existing: FoodPortionDto | undefined;
                    let newFoodPortion: FoodPortionDto | undefined;

                    switch (creationDto.type) {
                        case 'product': {
                            const id = getCreationDtoId(creationDto);
                            existing = values.items.find((x) => x.type === 'product' && getFoodPortionId(x) === id);

                            if (!existing) {
                                throw new Error('Cannot edit an item that did not exist');
                            }

                            newFoodPortion = createProductPortionFromCreation(
                                creationDto,
                                (existing as FoodPortionProductDto).product,
                            );
                            break;
                        }
                        case 'meal': {
                            const id = getCreationDtoId(creationDto);
                            existing = values.items.find((x) => x.type === 'meal' && getFoodPortionId(x) === id);

                            if (!existing) {
                                throw new Error('Cannot edit an item that did not exist');
                            }

                            newFoodPortion = createMealPortionFromCreation(
                                creationDto,
                                mapFoodPortionMealDtoToMealInfo(existing as FoodPortionMealDto),
                            );
                            break;
                        }
                        default:
                            break;
                    }

                    setValues({
                        ...values,
                        items: values.items.map((x) => (x === existing ? newFoodPortion! : x)),
                    });
                };

                return (
                    <View style={styles.root}>
                        <TextInput label="Name" value={values.name} onChangeText={(x) => setFieldValue('name', x)} />
                        <FoodPortionHeader foodPortions={values.items} header="Items" style={styles.itemsHeading} />
                        <FlatList
                            style={styles.list}
                            data={values.items}
                            renderItem={({ item }) => {
                                switch (item.type) {
                                    case 'product':
                                        return (
                                            <ProductFoodPortionView
                                                foodPortion={item}
                                                onPress={(executeEdit) =>
                                                    CreateEditProductDelegate(navigation)(item, executeEdit)
                                                }
                                                onLongPress={() => setOptionsFoodPortion(item)}
                                                onEdit={onEdit}
                                                onRemove={() => removeItem(item)}
                                            />
                                        );
                                    case 'custom':
                                        return (
                                            <CustomFoodPortionView
                                                foodPortion={item}
                                                onPress={() => {}}
                                                onLongPress={() => setOptionsFoodPortion(item)}
                                                onEdit={onEdit}
                                                onRemove={() => removeItem(item)}
                                            />
                                        );
                                    case 'meal':
                                        return (
                                            <MealPortionReadOnlyView
                                                meal={item}
                                                onPress={(executeEdit) =>
                                                    CreateEditMealDelegate(navigation)(item, executeEdit)
                                                }
                                                onLongPress={() => setOptionsFoodPortion(item)}
                                                onEdit={onEdit}
                                                onRemove={() => removeItem(item)}
                                            />
                                        );
                                    case 'suggestion':
                                        throw 'No';
                                }
                            }}
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

                                        switch (newFoodPortion.type) {
                                            case 'custom':
                                            case 'product':
                                            case 'suggestion':
                                                appendFood(newFoodPortion);
                                                break;
                                            case 'meal':
                                                setAppendMeal(newFoodPortion);
                                                break;
                                        }
                                    },
                                })
                            }
                        />
                        <Portal>
                            <Dialog visible={!!appendMeal} onDismiss={() => setAppendMeal(undefined)}>
                                <Dialog.Title numberOfLines={1} lineBreakMode="tail">
                                    {appendMeal && `Add ${appendMeal.mealName}`}
                                </Dialog.Title>
                                <Dialog.Content>
                                    <Paragraph>
                                        Add meal as link meaning you cannot change the items of that meal but updates
                                        will be inherited or only add items?
                                    </Paragraph>
                                </Dialog.Content>
                                <DialogButton
                                    onPress={() => {
                                        appendFood(appendMeal!);
                                        setAppendMeal(undefined);
                                    }}
                                >
                                    Add link
                                </DialogButton>
                                <Divider />
                                <DialogButton
                                    onPress={() => {
                                        appendMeal!.items.forEach(appendFood);
                                        setAppendMeal(undefined);
                                    }}
                                >
                                    Add items
                                </DialogButton>
                            </Dialog>
                            <Dialog visible={!!optionsFoodPortion} onDismiss={() => setOptionsFoodPortion(undefined)}>
                                <DialogButton
                                    color="#e74c3c"
                                    onPress={() => {
                                        removeItem(optionsFoodPortion!);
                                        setOptionsFoodPortion(undefined);
                                    }}
                                >
                                    Remove
                                </DialogButton>
                            </Dialog>
                        </Portal>
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

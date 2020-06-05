import { StackNavigationProp } from '@react-navigation/stack';
import itiriri from 'itiriri';
import { DateTime } from 'luxon';
import {
    ConsumedDto,
    ConsumptionTime,
    FoodPortionCreationDto,
    FoodPortionDto,
    FoodPortionMealDto,
    MealFoodPortionCreationDto,
    ProductFoodPortionCreationDto,
    ProductInfo,
    ProductSuggestion,
    SuggestionFoodPortionCreationDto,
} from 'Models';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect, useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { Button, Dialog, Divider, Paragraph, Portal } from 'react-native-paper';
import { connect } from 'react-redux';
import { CreateEditProductDelegate } from 'src/components-domain/food-portion-edit-helper';
import FoodPortionHeader from 'src/components-domain/FoodPortionHeader';
import { CustomFoodPortionView, ProductFoodPortionView } from 'src/components-domain/FoodPortionView';
import MealPortionView, { SuggestionPortionView } from 'src/components-domain/MealPortionView';
import { RootStackParamList } from 'src/RootNavigator';
import * as productApi from 'src/services/api/products';
import { createProductPortionFromCreation, getConsumedDtoId, getFoodPortionId } from 'src/utils/different-foods';
import { flattenProductsPrioritize } from 'src/utils/food-flattening';
import { changeVolume } from 'src/utils/product-utils';
import * as actions from '../actions';
import * as selectors from '../selectors';
import ConsumptionTimeFooter from './ConsumptionTimeFooter';
import DiaryHeader from './DiaryHeader';
import FoodPortionDialog, { ShowOptionsInfo } from './FoodPortionDialog';

const timeTitles: { [time in ConsumptionTime]: string } = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
};

const mapStateToProps = (state: RootState) => ({
    sections: selectors.getConsumedProductsSections(state),
    frequentlyUsedProducts: state.diary.frequentlyUsedProducts,
    selectedDay: state.diary.selectedDate,
    nutritionGoal: state.diary.nutritionGoal,
});

const dispatchProps = {
    loadFrequentlyUsedProducts: actions.loadFrequentlyUsedProducts.request,
    loadDate: actions.setSelectedDate.request,
    patchConsumptions: actions.patchConsumptions.request,
    loadNutritionGoal: actions.loadNutritionGoal.request,
};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps & {
        navigation: StackNavigationProp<RootStackParamList>;
    };

function TabDiary({
    navigation,
    loadFrequentlyUsedProducts,
    loadDate,
    sections,
    selectedDay,
    frequentlyUsedProducts,
    patchConsumptions,
    nutritionGoal,
    loadNutritionGoal,
}: Props) {
    useEffect(() => {
        if (frequentlyUsedProducts === undefined) {
            loadFrequentlyUsedProducts();
        }
        loadDate(DateTime.local().toISODate());

        if (nutritionGoal == null) {
            loadNutritionGoal();
        }
    }, [frequentlyUsedProducts]);

    const [unlistedProduct, setUnlistedProduct] = useState<string | undefined>();
    const [foodPortionOptions, setFoodPortionOptions] = useState<ShowOptionsInfo | undefined>();

    const scanBarcode = (time: ConsumptionTime) => {
        navigation.navigate('ScanBarcode', {
            onBarcodeScanned: async ({ data: barcode }, nav) => {
                let product: ProductInfo | undefined = (itiriri(
                    flattenProductsPrioritize(frequentlyUsedProducts, time),
                ).find((x) => x.type === 'product' && x.product.code === barcode) as ProductSuggestion)?.product;

                if (product === undefined) {
                    try {
                        product = await productApi.searchByBarcode(barcode);
                    } catch (error) {
                        return false;
                    }
                }

                if (product !== undefined) {
                    nav.replace('AddProduct', {
                        product,
                        onSubmit: (amount, servingType) => {
                            const creationDto: ProductFoodPortionCreationDto = {
                                type: 'product',
                                amount,
                                servingType,
                                productId: product!.id,
                            };

                            patchConsumptions({
                                date: selectedDay,
                                time,
                                creationDto,
                                foodPortion: createProductPortionFromCreation(creationDto, product!),
                                append: true,
                            });
                        },
                    });
                    return true;
                } else {
                    setUnlistedProduct(barcode);
                    return false;
                }
            },
        });
    };

    const onPressProduct = CreateEditProductDelegate(navigation);

    const onPressMeal = async (
        foodPortion: FoodPortionMealDto,
        executeEdit: (changes: Partial<MealFoodPortionCreationDto>) => void,
    ) => {
        navigation.navigate('SelectMealPortion', {
            mealName: foodPortion.mealName,
            nutritionalInfo: changeVolume(
                foodPortion.nutritionalInfo,
                foodPortion.nutritionalInfo.volume / foodPortion.portion,
            ),
            initialPortion: foodPortion.portion,
            onSubmit: (portion: number) => {
                const creationDto: MealFoodPortionCreationDto = {
                    type: 'meal',
                    portion,
                    mealId: foodPortion.mealId,
                };

                executeEdit(creationDto);
            },
        });
    };

    const editConsumedDto = async (item: ConsumedDto, creationDto: FoodPortionCreationDto) => {
        let foodPortion: FoodPortionDto | undefined;

        switch (item.foodPortion.type) {
            case 'product':
                foodPortion = createProductPortionFromCreation(
                    creationDto as ProductFoodPortionCreationDto,
                    item.foodPortion.product,
                );
                break;
            case 'meal':
                const mealCreationDto = creationDto as MealFoodPortionCreationDto;
                if (mealCreationDto.overwriteIngredients?.length === 0) {
                    // remove entire meal if no items will be left
                    removeConsumedDto(item);
                    return;
                }
                break;
            case 'suggestion':
                const suggestionCreationDto = creationDto as SuggestionFoodPortionCreationDto;
                if (suggestionCreationDto.items.length === 0) {
                    // remove entire meal if no items will be left
                    removeConsumedDto(item);
                    return;
                }
                break;
        }

        patchConsumptions({
            date: selectedDay,
            time: item.time,
            creationDto,
            foodPortion,
            append: false,
        });
    };

    const removeConsumedDto = async (consumedDto: ConsumedDto) => {
        patchConsumptions({
            delete: true,
            date: selectedDay,
            time: consumedDto.time,
            foodPortionId: getFoodPortionId(consumedDto.foodPortion),
        });
    };

    const mealEditItem = (
        foodPortion: FoodPortionDto,
        executeEdit: (changes: Partial<FoodPortionCreationDto>) => void,
    ) => {
        switch (foodPortion.type) {
            case 'product':
                onPressProduct(foodPortion, executeEdit);
                break;
            case 'meal':
                onPressMeal(foodPortion, executeEdit);
                break;
            default:
                console.log(foodPortion);
                throw new Error('Not implemented');
        }
    };

    return (
        <View style={styles.root}>
            <DiaryHeader />
            <SectionList
                style={{ flex: 1 }}
                sections={sections}
                keyExtractor={(x) => getConsumedDtoId(x)}
                renderItem={({ item }) => {
                    const foodPortion = item.foodPortion;

                    switch (foodPortion.type) {
                        case 'product':
                            return (
                                <ProductFoodPortionView
                                    foodPortion={foodPortion}
                                    onPress={(executeEdit) => onPressProduct(foodPortion, executeEdit)}
                                    onLongPress={(executeEdit, handleRemove) =>
                                        setFoodPortionOptions({
                                            foodPortion,
                                            handleRemove,
                                            handleEdit: () => onPressProduct(foodPortion, executeEdit),
                                        })
                                    }
                                    onEdit={(creationDto) => editConsumedDto(item, creationDto)}
                                    onRemove={() => removeConsumedDto(item)}
                                />
                            );
                        case 'custom':
                            return (
                                <CustomFoodPortionView
                                    foodPortion={foodPortion}
                                    onPress={() => {
                                        throw new Error('Not implemented');
                                    }}
                                    onLongPress={(_, handleRemove) =>
                                        setFoodPortionOptions({ foodPortion, handleRemove })
                                    }
                                    onEdit={(creationDto) => editConsumedDto(item, creationDto)}
                                    onRemove={() => removeConsumedDto(item)}
                                />
                            );
                        case 'meal':
                            return (
                                <MealPortionView
                                    foodPortion={foodPortion}
                                    onEdit={(creationDto) => editConsumedDto(item, creationDto)}
                                    onPress={(executeEdit) => onPressMeal(foodPortion, executeEdit)}
                                    onLongPress={(executeEdit, handleRemove) =>
                                        setFoodPortionOptions({
                                            foodPortion,
                                            handleRemove,
                                            handleEdit: () => onPressMeal(foodPortion, executeEdit),
                                        })
                                    }
                                    onItemPress={(foodPortion, executeEdit) => mealEditItem(foodPortion, executeEdit)}
                                    onItemLongPress={(foodPortion, executeEdit, handleRemove) =>
                                        setFoodPortionOptions({
                                            foodPortion,
                                            handleRemove,
                                            handleEdit: () => mealEditItem(foodPortion, executeEdit),
                                        })
                                    }
                                    onRemove={() => removeConsumedDto(item)}
                                />
                            );
                        case 'suggestion':
                            return (
                                <SuggestionPortionView
                                    foodPortion={foodPortion}
                                    onPress={() => {}}
                                    onLongPress={(_, handleRemove) =>
                                        setFoodPortionOptions({
                                            foodPortion,
                                            handleRemove,
                                        })
                                    }
                                    onItemPress={(foodPortion, executeEdit) => mealEditItem(foodPortion, executeEdit)}
                                    onItemLongPress={(foodPortion, executeEdit, handleRemove) =>
                                        setFoodPortionOptions({
                                            foodPortion,
                                            handleRemove,
                                            handleEdit: () => mealEditItem(foodPortion, executeEdit),
                                        })
                                    }
                                    onEdit={(creationDto) => editConsumedDto(item, creationDto)}
                                    onRemove={() => removeConsumedDto(item)}
                                />
                            );
                    }
                }}
                ItemSeparatorComponent={() => <Divider />}
                renderSectionHeader={({ section: { key } }) => {
                    const section = sections.find((x) => x.key === key)!;
                    return (
                        <FoodPortionHeader
                            foodPortions={section.data.map((x) => x.foodPortion)}
                            header={(timeTitles as any)[section.time]}
                            style={{ marginTop: 8 }}
                        />
                    );
                }}
                renderSectionFooter={({ section }) => (
                    <ConsumptionTimeFooter
                        style={{ marginBottom: 8 }}
                        section={section}
                        onAddFood={() =>
                            navigation.navigate('SearchProduct', {
                                config: { consumptionTime: section.time, date: selectedDay },
                                onCreated: (creationDto, foodPortion) => {
                                    if (creationDto.type === 'suggestion') {
                                        // we merge suggestions to allow the user to comforatably edit meals etc.
                                        for (const item of creationDto.items) {
                                            patchConsumptions({
                                                time: section.time,
                                                append: true,
                                                creationDto: item,
                                                date: selectedDay,
                                            });
                                        }
                                    } else {
                                        patchConsumptions({
                                            time: section.time,
                                            append: true,
                                            creationDto,
                                            foodPortion,
                                            date: selectedDay,
                                        });
                                    }
                                },
                            })
                        }
                        onMoreOptions={() => {}}
                        onScanBarcode={() => scanBarcode(section.time)}
                    />
                )}
            />

            <Portal>
                <FoodPortionDialog
                    value={foodPortionOptions}
                    navigation={navigation}
                    onDismiss={() => setFoodPortionOptions(undefined)}
                />
                <Dialog visible={!!unlistedProduct} onDismiss={() => setUnlistedProduct(undefined)}>
                    <Dialog.Title>Not found</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            There was no product found with this barcode. Do you mind taking 2 minutes and add it to our
                            database?
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setUnlistedProduct(undefined)}>Cancel</Button>
                        <Button
                            onPress={() => {
                                navigation.navigate('CreateProduct', { initialValues: { code: unlistedProduct } });
                                setUnlistedProduct(undefined);
                            }}
                        >
                            Create
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
});

export default connect(mapStateToProps, dispatchProps)(TabDiary);

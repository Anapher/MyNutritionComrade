import { StackNavigationProp } from '@react-navigation/stack';
import itiriri from 'itiriri';
import { DateTime } from 'luxon';
import {
    ConsumedDto,
    ConsumptionTime,
    ProductFoodPortionCreationDto,
    ProductInfo,
    ProductSuggestion,
    FoodPortionItemDto,
    FoodPortionMealDto,
    MealFoodPortionCreationDto,
    FoodPortionDto,
} from 'Models';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SectionList } from 'react-native';
import { Divider, Portal, Dialog, Paragraph, Button } from 'react-native-paper';
import { connect } from 'react-redux';
import AnimatedSectionList from 'src/components/AnimatedSectionList';
import { RootStackParamList } from 'src/RootNavigator';
import * as productApi from 'src/services/api/products';
import {
    createProductPortionFromCreation,
    getConsumedDtoId,
    mapFoodPortionDtoCreationDto,
    createMealPortionFromCreation,
    getFoodPortionId,
} from 'src/utils/different-foods';
import * as actions from '../actions';
import * as selectors from '../selectors';
import ConsumptionTimeFooter from './ConsumptionTimeFooter';
import DiaryHeader from './DiaryHeader';
import { flattenProductsPrioritize } from 'src/utils/food-flattening';
import { CustomFoodPortionView, ProductFoodPortionView } from 'src/componants-domain/FoodPortionView';
import FoodPortionHeader from 'src/componants-domain/FoodPortionHeader';
import MealPortionView from 'src/componants-domain/MealPortionView';
import FoodPortionDialog, { ShowOptionsInfo } from './FoodPortionDialog';
import { changeVolume } from 'src/utils/product-utils';
import { parse } from 'search-params';

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
        loadFrequentlyUsedProducts();
        loadDate(DateTime.local().toISODate());

        if (nutritionGoal == null) {
            loadNutritionGoal();
        }
    }, []);

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

    const editItem = async (item: ConsumedDto) => {
        switch (item.foodPortion.type) {
            case 'product':
                const product = item.foodPortion.product;
                navigation.navigate('AddProduct', {
                    product,
                    volume: item.foodPortion.nutritionalInfo.volume /** submit amount and serving type */,
                    onSubmit: (amount, servingType) => {
                        const creationDto: ProductFoodPortionCreationDto = {
                            type: 'product',
                            amount,
                            servingType,
                            productId: product.id,
                        };

                        patchConsumptions({
                            date: selectedDay,
                            time: item.time,
                            creationDto,
                            foodPortion: createProductPortionFromCreation(creationDto, product),
                            append: false,
                        });
                    },
                });
                break;
            case 'meal':
                const mealFoodPortion = item.foodPortion;
                navigation.navigate('SelectMealPortion', {
                    mealName: mealFoodPortion.mealName,
                    nutritionalInfo: changeVolume(
                        mealFoodPortion.nutritionalInfo,
                        mealFoodPortion.nutritionalInfo.volume * mealFoodPortion.portion,
                    ),
                    initialPortion: mealFoodPortion.portion,
                    onSubmit: (portion: number) => {
                        const creationDto: MealFoodPortionCreationDto = {
                            type: 'meal',
                            portion,
                            mealId: mealFoodPortion.mealId,
                        };

                        patchConsumptions({
                            date: selectedDay,
                            time: item.time,
                            creationDto,
                            append: false,
                        });
                    },
                });
                break;
            default:
                break;
        }
    };

    const mealEditItem = (consumedDto: ConsumedDto, item: FoodPortionItemDto) => {
        const meal = consumedDto.foodPortion;
        if (meal.type !== 'meal') throw 'Must submit meal';

        switch (item.type) {
            case 'product':
                const product = item.product;
                navigation.navigate('AddProduct', {
                    product,
                    volume: item.nutritionalInfo.volume /** submit amount and serving type */,
                    onSubmit: (amount, servingType) => {
                        const productOverwrite: ProductFoodPortionCreationDto = {
                            type: 'product',
                            amount,
                            servingType,
                            productId: product.id,
                        };

                        const creationDto: MealFoodPortionCreationDto = {
                            type: 'meal',
                            mealId: meal.mealId,
                            portion: meal.portion,
                            overwriteIngredients: meal.items.map((x) =>
                                x === item ? productOverwrite : mapFoodPortionDtoCreationDto(x),
                            ),
                        };

                        const newItems = meal.items.map((x) =>
                            x === item ? createProductPortionFromCreation(productOverwrite, item.product) : x,
                        );

                        patchConsumptions({
                            date: selectedDay,
                            time: consumedDto.time,
                            creationDto,
                            foodPortion: { ...meal, items: newItems },
                            append: false,
                        });
                    },
                });
                break;
            default:
                break;
        }
    };

    const removeItem = (options: ShowOptionsInfo) => {
        if (options.foodPortion) {
            if (options.consumedDto.foodPortion.type === 'meal') {
                const meal = options.consumedDto.foodPortion;

                const newItems = meal.items.filter(
                    (x) => getFoodPortionId(x) !== getFoodPortionId(options.foodPortion!),
                );

                if (newItems.length === 0) {
                    // remove entire meal if no items will be left
                    removeItem({ consumedDto: options.consumedDto });
                    return;
                }

                const creationDto: MealFoodPortionCreationDto = {
                    type: 'meal',
                    mealId: meal.mealId,
                    portion: meal.portion,
                    overwriteIngredients: newItems.map(mapFoodPortionDtoCreationDto),
                };

                patchConsumptions({
                    date: selectedDay,
                    time: options.consumedDto.time,
                    creationDto,
                    foodPortion: { ...meal, items: newItems },
                    append: false,
                });
            }
        } else {
            patchConsumptions({
                delete: true,
                date: selectedDay,
                time: options.consumedDto.time,
                foodPortionId: getFoodPortionId(options.consumedDto.foodPortion),
            });
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
                    switch (item.foodPortion.type) {
                        case 'product':
                            return (
                                <ProductFoodPortionView
                                    foodPortion={item.foodPortion}
                                    onPress={() => editItem(item)}
                                    onLongPress={() => setFoodPortionOptions({ consumedDto: item })}
                                />
                            );
                        case 'custom':
                            return (
                                <CustomFoodPortionView
                                    foodPortion={item.foodPortion}
                                    onPress={() => editItem(item)}
                                    onLongPress={() => setFoodPortionOptions({ consumedDto: item })}
                                />
                            );
                        case 'meal':
                            return (
                                <MealPortionView
                                    meal={item.foodPortion}
                                    onPress={() => editItem(item)}
                                    onLongPress={() => setFoodPortionOptions({ consumedDto: item })}
                                    onItemPress={(x) => mealEditItem(item, x)}
                                    onItemLongPress={(foodPortion) =>
                                        setFoodPortionOptions({ consumedDto: item, foodPortion })
                                    }
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
                                onCreated: (creationDto, foodPortion) =>
                                    patchConsumptions({
                                        time: section.time,
                                        append: true,
                                        creationDto,
                                        foodPortion,
                                        date: selectedDay,
                                    }),
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
                    onRemoveItem={(x) => removeItem(x)}
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

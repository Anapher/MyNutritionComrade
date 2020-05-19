import { StackNavigationProp } from '@react-navigation/stack';
import itiriri from 'itiriri';
import { DateTime } from 'luxon';
import { ConsumedDto, ConsumptionTime, ProductFoodPortionCreationDto, ProductInfo, ProductSuggestion } from 'Models';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { connect } from 'react-redux';
import AnimatedSectionList from 'src/components/AnimatedSectionList';
import { RootStackParamList } from 'src/RootNavigator';
import * as productApi from 'src/services/api/products';
import { createProductPortionFromCreation, getConsumedDtoId } from 'src/utils/different-foods';
import * as actions from '../actions';
import * as selectors from '../selectors';
import ConsumptionTimeFooter from './ConsumptionTimeFooter';
import DiaryHeader from './DiaryHeader';
import { flattenProductsPrioritize } from 'src/utils/food-flattening';
import FoodPortionView from 'src/componants-domain/FoodPortionView';
import FoodPortionHeader from 'src/componants-domain/FoodPortionHeader';

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

        patchConsumptions({ delete: true, time: 'breakfast', date: 'asd', foodPortionId: 'asd' });
    }, []);

    const [unlistedProduct, setUnlistedProduct] = useState<string | undefined>();
    const [productOptions, setProductOptions] = useState<ConsumedDto | undefined>();

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
            default:
                break;
        }
    };

    return (
        <View style={styles.root}>
            <DiaryHeader />
            <AnimatedSectionList
                style={{ flex: 1 }}
                duration={300}
                rowHeight={56}
                sections={sections}
                keyExtractor={(x) => getConsumedDtoId(x)}
                renderItem={({ item }) => (
                    <FoodPortionView
                        foodPortion={item.foodPortion}
                        onPress={() => editItem(item)}
                        onLongPress={() => setProductOptions(item)}
                    />
                )}
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
            {/* <Portal>
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

                <Dialog visible={!!productOptions} onDismiss={() => setProductOptions(undefined)}>
                    <Dialog.Title numberOfLines={1} lineBreakMode="tail">
                        {productOptions && selectLabel(productOptions.label)}
                    </Dialog.Title>
                    <View>
                        <DialogButton
                            onPress={async () => {
                                const p = productOptions!;
                                const product = await productApi.getById(p.productId);
                                if (productOptions !== p) return;

                                navigation.navigate('ProductOverview', { product });
                                setProductOptions(undefined);
                            }}
                        >
                            Show Product
                        </DialogButton>
                        <Divider />
                        <DialogButton
                            onPress={() => {
                                editItem(productOptions!);
                                setProductOptions(undefined);
                            }}
                        >
                            Change volume
                        </DialogButton>
                        <Divider />
                        <AsyncDialogButton
                            onPress={async () => {
                                const p = productOptions!;
                                const product = await productApi.getById(p.productId);
                                if (productOptions !== p) return;

                                navigation.navigate('ChangeProduct', { product });
                                setProductOptions(undefined);
                            }}
                        >
                            Suggest Changes
                        </AsyncDialogButton>
                        <Divider />
                        <AsyncDialogButton
                            onPress={async () => {
                                const p = productOptions!;
                                const product = await productApi.getById(p.productId);
                                if (productOptions !== p) return;

                                navigation.navigate('VoteProductChanges', { product });
                                setProductOptions(undefined);
                            }}
                        >
                            Show Changes
                        </AsyncDialogButton>
                        <Divider />
                        <DialogButton
                            color="#e74c3c"
                            onPress={() => {
                                patchConsumptions({
                                    append: false,
                                    date: selectedDay,
                                    product: { ...productOptions!, id: productOptions!.productId },
                                    time: productOptions!.time,
                                    value: 0,
                                });
                                setProductOptions(undefined);
                            }}
                        >
                            Remove
                        </DialogButton>
                    </View>
                </Dialog>
            </Portal>*/}
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

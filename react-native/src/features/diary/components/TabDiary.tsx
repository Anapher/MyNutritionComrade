import { StackNavigationProp } from '@react-navigation/stack';
import { AxiosError } from 'axios';
import itiriri from 'itiriri';
import { DateTime } from 'luxon';
import { ConsumedProduct, ConsumptionTime, ProductInfo } from 'Models';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Divider, Paragraph, Portal } from 'react-native-paper';
import { connect } from 'react-redux';
import AnimatedSectionList from 'src/components/AnimatedSectionList';
import AsyncDialogButton from 'src/components/AsyncDialogButton';
import DialogButton from 'src/components/DialogButton';
import { TagLiquid } from 'src/consts';
import { RootStackParamList } from 'src/RootNavigator';
import * as productApi from 'src/services/api/products';
import selectLabel, { flattenProductsPrioritize } from 'src/utils/product-utils';
import * as actions from '../actions';
import * as selectors from '../selectors';
import ConsumedProductItem from './ConsumedProductItem';
import ConsumptionTimeFooter from './ConsumptionTimeFooter';
import ConsumptionTimeHeader from './ConsumptionTimeHeader';
import DiaryHeader from './DiaryHeader';

const mapStateToProps = (state: RootState) => ({
    sections: selectors.getConsumedProductsSections(state),
    frequentlyUsedProducts: state.diary.frequentlyUsedProducts,
    selectedDay: state.diary.selectedDate,
    nutritionGoal: state.diary.nutritionGoal,
});

const dispatchProps = {
    loadFrequentlyUsedProducts: actions.loadFrequentlyUsedProducts.request,
    loadDate: actions.setSelectedDate.request,
    changeProductConsumption: actions.changeProductConsumption.request,
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
    changeProductConsumption,
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
    const [productOptions, setProductOptions] = useState<ConsumedProduct | undefined>();

    const scanBarcode = (time: ConsumptionTime) => {
        navigation.navigate('ScanBarcode', {
            onBarcodeScanned: async ({ data: barcode }, nav) => {
                let product: ProductInfo | undefined = itiriri(
                    flattenProductsPrioritize(frequentlyUsedProducts, time),
                ).find((x) => x.code === barcode);

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
                        onSubmit: (volume) => {
                            changeProductConsumption({
                                date: selectedDay,
                                time,
                                product: product!,
                                value: volume,
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

    const editItem = async (item: ConsumedProduct) => {
        let product: ProductInfo | undefined = itiriri(
            flattenProductsPrioritize(frequentlyUsedProducts, item.time),
        ).find((x) => x.id === item.productId);

        if (product === undefined) {
            try {
                product = await productApi.getById(item.productId);
            } catch (error) {
                const axiosError: AxiosError = error;
                if (axiosError.response?.status === 404) {
                    // message that product wasnt found
                }

                product = {
                    id: item.productId,
                    label: item.label,
                    nutritionalInfo: item.nutritionalInfo,
                    version: 1,
                    code: undefined,
                    tags: item.tags,
                    defaultServing: item.tags.includes(TagLiquid) ? 'ml' : 'g',
                    servings: {
                        [item.tags.includes(TagLiquid) ? 'ml' : 'g']: 1,
                    },
                };
            }
        }

        navigation.navigate('AddProduct', {
            product,
            volume: item.nutritionalInfo.volume,
            onSubmit: (volume) => {
                changeProductConsumption({
                    date: selectedDay,
                    time: item.time,
                    product: product!,
                    value: volume,
                    append: false,
                });
            },
        });
    };

    return (
        <View style={styles.root}>
            <DiaryHeader />
            <AnimatedSectionList
                style={{ flex: 1 }}
                duration={300}
                rowHeight={56}
                sections={sections}
                keyExtractor={({ time, productId }) => `${time}/${productId}`}
                renderItem={({ item }) => (
                    <ConsumedProductItem
                        product={item}
                        onPress={() => editItem(item)}
                        onLongPress={() => setProductOptions(item)}
                    />
                )}
                ItemSeparatorComponent={() => <Divider />}
                renderSectionHeader={({ section: { key } }) => (
                    <ConsumptionTimeHeader section={sections.find((x) => x.key === key)!} style={{ marginTop: 8 }} />
                )}
                renderSectionFooter={({ section }) => (
                    <ConsumptionTimeFooter
                        style={{ marginBottom: 8 }}
                        section={section}
                        onAddFood={() =>
                            navigation.navigate('SearchProduct', {
                                consumptionTime: section.time,
                                date: selectedDay,
                            })
                        }
                        onMoreOptions={() => {}}
                        onScanBarcode={() => scanBarcode(section.time)}
                    />
                )}
            />
            <Portal>
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
                                changeProductConsumption({
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

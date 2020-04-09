import { StackNavigationProp } from '@react-navigation/stack';
import { DateTime } from 'luxon';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect, useCallback, useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { Surface, Portal, Dialog, Paragraph, Button, Divider } from 'react-native-paper';
import { connect } from 'react-redux';
import { RootStackParamList } from 'src/RootNavigator';
import * as actions from '../actions';
import * as selectors from '../selectors';
import ConsumedProductItem from './ConsumedProductItem';
import ConsumptionTimeFooter from './ConsumptionTimeFooter';
import ConsumptionTimeHeader from './ConsumptionTimeHeader';
import DiaryHeader from './DiaryHeader';
import { AxiosError } from 'axios';
import { ConsumedProduct, ProductDto, ProductInfo, ConsumptionTime } from 'Models';
import itiriri from 'itiriri';
import { flattenProductsPrioritize } from 'src/utils/product-utils';
import * as productApi from 'src/services/api/products';
import { TagLiquid } from 'src/consts';

const mapStateToProps = (state: RootState) => ({
    sections: selectors.getConsumedProductsSections(state),
    frequentlyUsedProducts: state.diary.frequentlyUsedProducts,
    currentDate: state.diary.currentDate,
});

const dispatchProps = {
    loadFrequentlyUsedProducts: actions.loadFrequentlyUsedProducts.request,
    loadDate: actions.loadDate.request,
    changeProductConsumption: actions.changeProductConsumption.request,
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
    currentDate,
    frequentlyUsedProducts,
    changeProductConsumption,
}: Props) {
    useEffect(() => {
        loadFrequentlyUsedProducts();
        loadDate(DateTime.local().toISODate());
    }, []);

    const [unlistedProduct, setUnlistedProduct] = useState<string | undefined>();

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
                                date: currentDate,
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
        let product: ProductDto | undefined = itiriri(
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
                    date: currentDate,
                    time: item.time,
                    product: product!,
                    value: volume,
                    append: false,
                });
            },
        });
    };

    return (
        <Surface>
            <DiaryHeader />
            <SectionList
                sections={sections}
                keyExtractor={({ time, productId }) => `${time}/${productId}`}
                renderItem={({ item }) => <ConsumedProductItem product={item} onPress={() => editItem(item)} />}
                ItemSeparatorComponent={() => <Divider />}
                renderSectionHeader={({ section }) => (
                    <ConsumptionTimeHeader section={section} style={{ marginTop: 8 }} />
                )}
                renderSectionFooter={({ section }) => (
                    <ConsumptionTimeFooter
                        style={{ marginBottom: 8 }}
                        section={section}
                        onAddFood={() =>
                            navigation.navigate('SearchProduct', {
                                consumptionTime: section.time,
                                date: currentDate,
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
            </Portal>
        </Surface>
    );
}

const styles = StyleSheet.create({
    divider: {
        marginVertical: 8,
    },
});

export default connect(mapStateToProps, dispatchProps)(TabDiary);

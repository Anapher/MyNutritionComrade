import React, { useState } from 'react';
import FoodList from './FoodList';
import { ConsumptionTime, ProductSearchDto, ProductDto } from 'Models';
import { RootState } from 'MyNutritionComrade';
import { connect } from 'react-redux';
import * as selectors from '../selectors';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/RootNavigator';
import * as productApi from 'src/services/api/products';
import * as actions from '../actions';
import { View } from 'react-native';
import { Portal, Dialog, Paragraph, Button } from 'react-native-paper';
import { AxiosError } from 'axios';
import { TagLiquid } from 'src/consts';

const timeTitles: { [time in ConsumptionTime]: string } = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
};

type UserProps = {
    time: ConsumptionTime;
    navigation: StackNavigationProp<RootStackParamList>;
};

const mapStateToProps = (state: RootState, props: UserProps) => ({
    currentDate: state.diary.currentDate,
    consumedProducts: selectors.getConsumedProducts(state, props),
});

const dispatchProps = {
    changeProductConsumption: actions.changeProductConsumption.request,
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & UserProps;

function ConsumedProducts({ time, currentDate, consumedProducts, navigation, changeProductConsumption }: Props) {
    const [unlistedProduct, setUnlistedProduct] = useState<string | undefined>();

    return (
        <View>
            <FoodList
                title={timeTitles[time]}
                items={consumedProducts}
                onAddFood={() => navigation.navigate('SearchProduct', { consumptionTime: time, date: currentDate })}
                onScanBarcode={() =>
                    navigation.navigate('ScanBarcode', {
                        onBarcodeScanned: async (x) => {
                            let product: ProductSearchDto | undefined;
                            try {
                                product = await productApi.searchByBarcode(x.data);
                            } catch (error) {
                                return false;
                            }

                            navigation.goBack(); // close barcode scanner

                            if (product !== undefined) {
                                navigation.navigate('AddProduct', {
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
                            } else {
                                setUnlistedProduct(x.data);
                            }

                            return true;
                        },
                    })
                }
                onMoreOptions={() => {}}
                onItemPress={async (item) => {
                    let product: ProductDto | undefined;
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
                            nutritionInformation: item.nutritionInformation,
                            version: 1,
                            code: undefined,
                            tags: item.tags,
                            defaultServing: item.tags.includes(TagLiquid) ? 'ml' : 'g',
                            servings: {
                                [item.tags.includes(TagLiquid) ? 'ml' : 'g']: 1,
                            },
                        };
                    }

                    navigation.navigate('AddProduct', {
                        product,
                        volume: item.nutritionInformation.volume,
                        onSubmit: (volume) => {
                            changeProductConsumption({
                                date: currentDate,
                                time,
                                product: product!,
                                value: volume,
                                append: false,
                            });
                        },
                    });
                }}
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
                                navigation.navigate('CreateProduct', { product: { code: unlistedProduct } });
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

export default connect(mapStateToProps, dispatchProps)(ConsumedProducts);

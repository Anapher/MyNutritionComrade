import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
    ProductInfo,
    SearchResult,
    ServingSize,
    ProductFoodPortionCreationDto,
    CustomFoodPortionCreationDto,
} from 'Models';
import { RootState } from 'MyNutritionComrade';
import React from 'react';
import { Keyboard } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Divider, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import { RootStackParamList } from 'src/RootNavigator';
import SuggestionItem from './SuggestionItem';
import {
    mapFoodPortionDtoCreationDto,
    getSearchResultKey,
    createProductPortionFromCreation,
} from 'src/utils/different-foods';
import { sumNutritions } from 'src/utils/product-utils';

const mapStateToProps = (state: RootState) => ({
    suggestions: state.productSearch.suggestions,
});

type Props = ReturnType<typeof mapStateToProps> & {
    navigation: StackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'SearchProduct'>;
};

const getServingSizeValue = (servingSize: ServingSize, product: ProductInfo) =>
    product.servings[servingSize.servingType || product.defaultServing] * servingSize.amount;

function ProductSearchScreen({
    suggestions,
    navigation,
    route: {
        params: { onCreated },
    },
}: Props) {
    const theme = useTheme();

    const onPressItem = (item: SearchResult) => {
        switch (item.type) {
            case 'product':
                navigation.navigate('AddProduct', {
                    disableGoBack: true,
                    onSubmit: (amount, servingType) => {
                        const creationDto: ProductFoodPortionCreationDto = {
                            type: 'product',
                            amount,
                            servingType,
                            productId: item.product.id,
                        };

                        onCreated(creationDto, createProductPortionFromCreation(creationDto, item.product));
                        navigation.pop(2);
                    },
                    product: item.product,
                });
                break;
            case 'serving':
                const creationDto: ProductFoodPortionCreationDto = {
                    type: 'product',
                    amount: getServingSizeValue(item, item.product),
                    productId: item.product.id,
                    servingType: item.servingType,
                };

                onCreated(creationDto, createProductPortionFromCreation(creationDto, item.product));
                navigation.goBack();
                break;
            case 'meal':
                navigation.navigate('SelectMealPortion', {
                    mealName: item.mealName,
                    initialPortion: item.frequentlyUsedPortion?.portion,
                    nutritionalInfo: item.nutritionalInfo,
                    disableGoBack: true,
                    onSubmit: (portion: number) => {
                        onCreated({ type: 'meal', mealId: item.mealId, portion });
                        navigation.pop(2);
                    },
                });
                break;
            case 'generatedMeal':
                onCreated(
                    {
                        type: 'suggestion',
                        suggestionId: item.id,
                        items: item.items.map(mapFoodPortionDtoCreationDto),
                    },
                    {
                        type: 'suggestion',
                        suggestionId: item.id,
                        items: item.items,
                        nutritionalInfo: sumNutritions(item.items.map((x) => x.nutritionalInfo)),
                    },
                );
                navigation.goBack();
                break;
            case 'custom':
                const customCreationDto: CustomFoodPortionCreationDto = {
                    type: 'custom',
                    nutritionalInfo: item.nutritionalInfo,
                    label: item.label,
                };
                onCreated(customCreationDto, customCreationDto);
                navigation.goBack();
                break;
        }

        Keyboard.dismiss();
    };

    return (
        <FlatList
            data={suggestions}
            keyboardShouldPersistTaps="handled"
            style={{ backgroundColor: theme.colors.background }}
            ItemSeparatorComponent={() => <Divider inset />}
            keyExtractor={(x) => getSearchResultKey(x)}
            renderItem={({ item }) => <SuggestionItem item={item} onPress={() => onPressItem(item)} />}
        />
    );
}

export default connect(mapStateToProps)(ProductSearchScreen);

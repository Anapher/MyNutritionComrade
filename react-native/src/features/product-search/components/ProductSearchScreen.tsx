import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProductEssentialsWithId, ProductInfo, SearchResult, ServingSize } from 'Models';
import { RootState } from 'MyNutritionComrade';
import React from 'react';
import { Keyboard } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Divider, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import { RootStackParamList } from 'src/RootNavigator';
import * as actions from '../../diary/actions';
import SuggestionItem from './SuggestionItem';

const mapStateToProps = (state: RootState) => ({
    suggestions: state.productSearch.suggestions,
});

const dispatchProps = {
    changeProductConsumption: actions.changeProductConsumption.request,
};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps & {
        navigation: StackNavigationProp<RootStackParamList>;
        route: RouteProp<RootStackParamList, 'SearchProduct'>;
    };

const getServingSizeValue = (servingSize: ServingSize, product: ProductInfo) =>
    product.servings[servingSize.servingType || product.defaultServing] * servingSize.amount;

const getSearchResultId = (result: SearchResult): string => {
    switch (result.type) {
        case 'product':
            return result.product.id;
        case 'serving':
            return `${result.product.id}/${result.servingSize.servingType}`;
        case 'meal':
            return result.id;
    }
};

function ProductSearchScreen({ suggestions, navigation, route, changeProductConsumption }: Props) {
    const theme = useTheme();

    const execute = (product: ProductEssentialsWithId, value: number) => {
        changeProductConsumption({
            date: route.params.date,
            time: route.params.consumptionTime,
            product: product,
            value,
            append: true,
        });
    };

    const onPressItem = (item: SearchResult) => {
        switch (item.type) {
            case 'product':
                navigation.navigate('AddProduct', {
                    onSubmit: (value) => {
                        execute(item.product, value);
                        navigation.goBack();
                    },
                    product: item.product,
                });
                break;
            case 'serving':
                execute(item.product, getServingSizeValue(item.servingSize, item.product));
                navigation.goBack();

                break;
            case 'meal':
                item.products.forEach((x) => execute(x.product, x.servingSize.amount));
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
            keyExtractor={getSearchResultId}
            renderItem={({ item }) => <SuggestionItem item={item} onPress={() => onPressItem(item)} />}
        />
    );
}

export default connect(mapStateToProps, dispatchProps)(ProductSearchScreen);

import { RootState } from 'MyNutritionComrade';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Divider, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import SuggestionItem from './SuggestionItem';
import * as actions from '../../diary/actions';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/RootNavigator';
import { RouteProp } from '@react-navigation/native';
import { Keyboard } from 'react-native';

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

function ProductSearchScreen({ suggestions, navigation, route, changeProductConsumption }: Props) {
    const theme = useTheme();
    return (
        <FlatList
            data={suggestions}
            keyboardShouldPersistTaps="handled"
            style={{ backgroundColor: theme.colors.background }}
            ItemSeparatorComponent={() => <Divider inset />}
            keyExtractor={(x) => `${x.model.id}/${x.servingSize?.unit}`}
            renderItem={({ item }) => (
                <SuggestionItem
                    item={item}
                    onPress={() => {
                        const execute = (value: number) => {
                            changeProductConsumption({
                                date: route.params.date,
                                time: route.params.consumptionTime,
                                product: item.model,
                                value,
                                append: true,
                            });
                            navigation.goBack();
                        };

                        if (item.servingSize?.size) {
                            let value = item.servingSize.size;
                            if (item.servingSize.conversion) {
                                value = item.servingSize.conversion.factor * value;
                            }
                            value = item.model.servings[item.servingSize.unit || item.model.defaultServing] * value;
                            execute(value);
                        } else {
                            navigation.navigate('AddProduct', {
                                onSubmit: execute,
                                product: item.model,
                            });
                        }

                        Keyboard.dismiss();
                    }}
                />
            )}
        />
    );
}

export default connect(mapStateToProps, dispatchProps)(ProductSearchScreen);

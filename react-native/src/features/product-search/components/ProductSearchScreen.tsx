import { RootState } from 'MyNutritionComrade';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';
import { connect } from 'react-redux';
import SuggestionItem from './SuggestionItem';
import * as actions from '../../diary/actions';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/RootNavigator';
import { RouteProp } from '@react-navigation/native';

const mapStateToProps = (state: RootState) => ({
    suggestions: state.productSearch.suggestions,
});

const dispatchProps = {
    appendProductConsumption: actions.appendProductConsumption,
};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps & {
        navigation: StackNavigationProp<RootStackParamList>;
        route: RouteProp<RootStackParamList, 'SearchProduct'>;
    };

function ProductSearchScreen({ suggestions, navigation, route, appendProductConsumption }: Props) {
    return (
        <FlatList
            data={suggestions}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <Divider inset />}
            keyExtractor={(x) => `${x.model.id}/${x.servingSize?.unit}`}
            renderItem={({ item }) => (
                <SuggestionItem
                    item={item}
                    onPress={() => {
                        if (item.servingSize?.size) {
                            let value = item.servingSize.size;
                            if (item.servingSize.conversion) {
                                value = item.servingSize.conversion.factor * value;
                            }
                            value = item.model.servings[item.servingSize.unit || item.model.defaultServing] * value;

                            appendProductConsumption({
                                date: route.params.date,
                                time: route.params.consumptionTime,
                                product: item.model,
                                value,
                            });
                            navigation.goBack();
                        }
                    }}
                />
            )}
        />
    );
}

export default connect(mapStateToProps, dispatchProps)(ProductSearchScreen);

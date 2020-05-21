import { StackNavigationProp } from '@react-navigation/stack';
import { Meal } from 'Models';
import { RootState } from 'MyNutritionComrade';
import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import LoadingPlaceholder from 'src/components/LoadingPlaceholder';
import useAsyncFunction from 'src/hooks/use-async-function';
import { RootStackParamList } from 'src/RootNavigator';
import * as actions from '../actions';
import MealItem from './MealItem';
import MealOptionsDialog from './MealOptionsDialog';
import { connect } from 'react-redux';

const mapStateToProps = (state: RootState) => ({
    meals: state.meals.meals,
    isLoading: state.meals.isLoading,
});

const dispatchProps = {
    loadMeals: actions.loadMealsAsync.request,
};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps & {
        navigation: StackNavigationProp<RootStackParamList>;
    };

function Meals({ meals, isLoading, navigation, loadMeals }: Props) {
    const [openedEntry, setOpenedEntry] = useState<Meal | undefined>();

    useEffect(() => {
        loadMeals();
    }, []);

    const removeAction = useAsyncFunction(
        actions.removeAsync.request,
        actions.removeAsync.success,
        actions.removeAsync.failure,
    );

    return (
        <LoadingPlaceholder loading={isLoading}>
            <View style={styles.root}>
                <FlatList
                    data={meals}
                    keyExtractor={(x) => x.id}
                    renderItem={(x) => (
                        <MealItem
                            meal={x.item}
                            onOptions={() => setOpenedEntry(x.item)}
                            onEdit={() => navigation.navigate('AddOrUpdateMeal')}
                        />
                    )}
                />
                <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate('AddOrUpdateMeal')} />
                <MealOptionsDialog
                    onRemove={(x) => removeAction!(x.id)}
                    entry={openedEntry}
                    onDismiss={() => setOpenedEntry(undefined)}
                />
            </View>
        </LoadingPlaceholder>
    );
}

export default connect(mapStateToProps, dispatchProps)(Meals);

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

import { StackNavigationProp } from '@react-navigation/stack';
import { Meal } from 'Models';
import { RootState } from 'MyNutritionComrade';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import LoadingPlaceholder from 'src/components/LoadingPlaceholder';
import useAsyncFunction from 'src/hooks/use-async-function';
import { RootStackParamList } from 'src/RootNavigator';
import * as actions from '../actions';
import MealItem from './MealItem';
import MealOptionsDialog from './MealOptionsDialog';

const mapStateToProps = (state: RootState) => ({
    meals: state.meals.meals,
    isLoading: state.meals.isLoading,
});

type Props = ReturnType<typeof mapStateToProps> & {
    navigation: StackNavigationProp<RootStackParamList>;
};

function Meals({ meals, isLoading, navigation }: Props) {
    const [openedEntry, setOpenedEntry] = useState<Meal | undefined>();

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
                            onEdit={() => navigation.navigate('AddUpdateMeal')}
                        />
                    )}
                />
                <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate('AddUpdateMeal')} />
                <MealOptionsDialog
                    onRemove={(x) => removeAction!(x.id)}
                    entry={openedEntry}
                    onDismiss={() => setOpenedEntry(undefined)}
                />
            </View>
        </LoadingPlaceholder>
    );
}

export default Meals;

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

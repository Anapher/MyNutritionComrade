import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CreateMealDto } from 'Models';
import { RootState } from 'MyNutritionComrade';
import React from 'react';
import { StyleSheet } from 'react-native';
import useAsyncFunction from 'src/hooks/use-async-function';
import { RootStackParamList } from 'src/RootNavigator';
import { mapFoodPortionDtoCreationDto } from 'src/utils/different-foods';
import * as actions from '../actions';
import MealEditor from './MealEditor';

const mapStateToProps = (state: RootState) => ({
    meals: state.meals.meals,
});

type Props = ReturnType<typeof mapStateToProps> & {
    navigation: StackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'EditMeal'>;
};

function EditMealDialog({
    navigation,
    route: {
        params: { meal },
    },
    meals,
}: Props) {
    const action = useAsyncFunction(
        actions.updateAsync.request,
        actions.updateAsync.success,
        actions.updateAsync.failure,
    )!;

    return (
        <MealEditor
            initialValue={meal}
            allMeals={meals!}
            navigation={navigation}
            onSubmit={async (value, helpers) => {
                const dto: CreateMealDto = {
                    name: value.name,
                    items: value.items.map(mapFoodPortionDtoCreationDto),
                };

                try {
                    await action({ dto, id: meal.id });
                    navigation.goBack();
                } catch (error) {
                } finally {
                    helpers.setSubmitting(false);
                }
            }}
        />
    );
}

export default EditMealDialog;

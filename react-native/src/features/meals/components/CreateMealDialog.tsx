import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CreateMealDto } from 'Models';
import { RootState } from 'MyNutritionComrade';
import React from 'react';
import { connect } from 'react-redux';
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
    route: RouteProp<RootStackParamList, 'CreateMeal'>;
};

function CreateMealDialog({ navigation, route: { params }, meals }: Props) {
    const action = useAsyncFunction(
        actions.createAsync.request,
        actions.createAsync.success,
        actions.createAsync.failure,
    )!;

    return (
        <MealEditor
            initialValue={params?.initialValue}
            allMeals={meals!}
            navigation={navigation}
            onSubmit={async (value, helpers) => {
                const creationDto: CreateMealDto = {
                    name: value.name,
                    items: value.items.map(mapFoodPortionDtoCreationDto),
                };

                try {
                    await action(creationDto);
                    navigation.goBack();
                } catch (error) {
                } finally {
                    helpers.setSubmitting(false);
                }
            }}
        />
    );
}

export default connect(mapStateToProps)(CreateMealDialog);

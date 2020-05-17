import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MealEditor from './MealEditor';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/RootNavigator';
import { RouteProp } from '@react-navigation/native';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, 'AddOrUpdateMeal'>;
};

function AddOrUpdateMeal({ navigation, route: { params } }: Props) {
    return (
        <MealEditor
            initialValue={params?.initialValue}
            navigation={navigation}
            onSubmit={() => {}}
            productInfos={[]}
            requestProducts={() => {}}
        />
    );
}

export default AddOrUpdateMeal;

const styles = StyleSheet.create({});

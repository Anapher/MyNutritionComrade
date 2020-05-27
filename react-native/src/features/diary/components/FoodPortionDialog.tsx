import { StackNavigationProp } from '@react-navigation/stack';
import { FoodPortionDto } from 'Models';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dialog, Divider } from 'react-native-paper';
import DialogButton from 'src/components/DialogButton';
import { RootStackParamList } from 'src/RootNavigator';
import { suggestionIdToString } from 'src/utils/food-utils';
import selectLabel from 'src/utils/product-utils';

export type ShowOptionsInfo = {
    foodPortion: FoodPortionDto;
    handleRemove: () => void;
    handleEdit?: () => void;
};

type Props = {
    value?: ShowOptionsInfo;
    onDismiss: () => void;

    navigation: StackNavigationProp<RootStackParamList>;
};

function getName(value: FoodPortionDto) {
    switch (value.type) {
        case 'product':
            return selectLabel(value.product.label);
        case 'custom':
            return value.label || 'Custom Food';
        case 'meal':
            return value.mealName;
        case 'suggestion':
            return suggestionIdToString(value.suggestionId);
    }
}

function FoodPortionDialog({ value, onDismiss, navigation }: Props) {
    const [foodPortion, setFoodPortion] = useState(value?.foodPortion);

    /** to prevent the buggy visual effect when the dialog is fading away */
    useEffect(() => {
        if (value) setFoodPortion(value.foodPortion);
    }, [value]);

    return (
        <Dialog visible={!!value} onDismiss={onDismiss}>
            <Dialog.Title numberOfLines={1} lineBreakMode="tail">
                {foodPortion && getName(foodPortion)}
            </Dialog.Title>
            <View>
                {foodPortion?.type === 'product' && (
                    <>
                        <DialogButton
                            onPress={async () => {
                                navigation.navigate('ProductOverview', { product: foodPortion.product });
                                onDismiss();
                            }}
                        >
                            Show Product
                        </DialogButton>
                        <Divider />
                        <DialogButton
                            onPress={() => {
                                navigation.navigate('ChangeProduct', { product: foodPortion.product });
                                onDismiss();
                            }}
                        >
                            Suggest Changes
                        </DialogButton>
                        <Divider />
                        <DialogButton
                            onPress={() => {
                                navigation.navigate('VoteProductChanges', { product: foodPortion.product });
                                onDismiss();
                            }}
                        >
                            Show Changes
                        </DialogButton>
                        <Divider />
                    </>
                )}
                <DialogButton
                    color="#e74c3c"
                    onPress={() => {
                        value?.handleRemove();
                        onDismiss();
                    }}
                >
                    Remove
                </DialogButton>
            </View>
        </Dialog>
    );
}

export default FoodPortionDialog;

const styles = StyleSheet.create({});

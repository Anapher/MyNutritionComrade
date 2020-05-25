import { StackNavigationProp } from '@react-navigation/stack';
import { ConsumedDto, FoodPortionDto } from 'Models';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Dialog, Divider } from 'react-native-paper';
import DialogButton from 'src/components/DialogButton';
import { RootStackParamList } from 'src/RootNavigator';
import selectLabel from 'src/utils/product-utils';
import { suggestionIdToString } from 'src/utils/food-utils';

export type ShowOptionsInfo = {
    foodPortion?: FoodPortionDto;
    consumedDto: ConsumedDto;
};

type Props = {
    value?: ShowOptionsInfo;
    onDismiss: () => void;
    onRemoveItem: (value: ShowOptionsInfo) => void;

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

function FoodPortionDialog({ value, onDismiss, navigation, onRemoveItem }: Props) {
    const foodPortion = value?.foodPortion || value?.consumedDto.foodPortion;

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
                        onRemoveItem(value!);
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

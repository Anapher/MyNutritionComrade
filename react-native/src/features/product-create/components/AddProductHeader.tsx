import React from 'react';
import { Appbar } from 'react-native-paper';
import { RootStackParamList } from 'src/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    canSubmit: boolean;
    onSubmit: () => void;
};

export default function AddProductHeader({ navigation, canSubmit, onSubmit }: Props) {
    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title="Add Product" />
            <Appbar.Action icon="check" disabled={!canSubmit} onPress={onSubmit} />
        </Appbar.Header>
    );
}

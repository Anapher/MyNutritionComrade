import React from 'react';
import { Appbar } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/RootNavigator';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    canSubmit: boolean;
    title: string;
    onSubmit: () => void;
};

export default function AddProductHeader({ navigation, onSubmit, canSubmit, title }: Props) {
    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={title} />
            <Appbar.Action icon="check" disabled={!canSubmit} onPress={onSubmit} />
        </Appbar.Header>
    );
}

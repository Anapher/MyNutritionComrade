import React from 'react';
import { Appbar } from 'react-native-paper';
import { RootStackParamList } from 'src/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
    navigation: StackNavigationProp<RootStackParamList>;
    canSubmit: boolean;
    title: string;
    icon?: string;
    onSubmit: () => void;
};

export default function ProductEditorHeader({ navigation, canSubmit, onSubmit, title, icon = 'check' }: Props) {
    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={title} />
            <Appbar.Action icon={icon} disabled={!canSubmit} onPress={onSubmit} />
        </Appbar.Header>
    );
}

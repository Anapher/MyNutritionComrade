import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';

type Props = {
    title: string;
    canSubmit: boolean;
    onGoBack: () => void;
    onSubmit: () => void;
};

function MealEditorHeader({ title, canSubmit, onSubmit, onGoBack }: Props) {
    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={onGoBack} />
            <Appbar.Content title={title} />
            <Appbar.Action icon="check" disabled={!canSubmit} onPress={onSubmit} />
        </Appbar.Header>
    );
}

export default MealEditorHeader;

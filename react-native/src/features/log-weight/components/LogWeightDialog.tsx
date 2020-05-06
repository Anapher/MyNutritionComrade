import React, { useState } from 'react';
import { StyleSheet, Text, View, ToastAndroid } from 'react-native';
import { Portal, Dialog, TextInput, Button } from 'react-native-paper';
import { toString } from 'src/utils/error-result';

type Props = {
    open: boolean;
    onDismiss: () => void;
    onSubmit: (value: number) => Promise<any>;
};

function LogWeightDialog({ open, onDismiss, onSubmit }: Props) {
    const [currentValue, setCurrentValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const checkValue = () => {
        const n = Number(currentValue);
        return !Number.isNaN(n) && n > 0;
    };

    const handleSubmit = async () => {
        if (!checkValue()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(Number(currentValue));
        } catch (error) {
            ToastAndroid.show(toString(error), 5000);
            return;
        } finally {
            setIsSubmitting(false);
        }

        onDismiss();
    };

    return (
        <Portal>
            <Dialog visible={open} onDismiss={onDismiss}>
                <Dialog.Title>Log Weight</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        keyboardType="numeric"
                        label="Weight in kg"
                        autoFocus
                        value={currentValue}
                        onChangeText={(x) => setCurrentValue(x.replace(',', '.'))}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Cancel</Button>
                    <Button disabled={isSubmitting || !checkValue()} loading={isSubmitting} onPress={handleSubmit}>
                        Add Weight
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export default LogWeightDialog;

const styles = StyleSheet.create({});

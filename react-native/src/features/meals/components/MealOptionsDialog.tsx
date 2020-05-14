import { Meal } from 'Models';
import React, { useState } from 'react';
import { ToastAndroid } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import DialogButton from 'src/components/DialogButton';
import { toString } from 'src/utils/error-result';

type Props = {
    entry?: Meal;
    onDismiss: () => void;
    onRemove: (entry: Meal) => Promise<any>;
};

function MealOptionsDialog({ entry, onDismiss, onRemove }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <Portal>
            <Dialog visible={!!entry} onDismiss={onDismiss}>
                <Dialog.Title>{entry?.name}</Dialog.Title>
                <DialogButton
                    loading={isDeleting}
                    disabled={isDeleting}
                    onPress={async () => {
                        setIsDeleting(true);
                        try {
                            await onRemove(entry!);
                            onDismiss();
                        } catch (error) {
                            ToastAndroid.show(toString(error), 5000);
                        } finally {
                            setIsDeleting(false);
                        }
                    }}
                >
                    Delete
                </DialogButton>
            </Dialog>
        </Portal>
    );
}

export default MealOptionsDialog;

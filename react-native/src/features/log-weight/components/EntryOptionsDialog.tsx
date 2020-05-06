import React, { useState } from 'react';
import { StyleSheet, Text, View, ToastAndroid } from 'react-native';
import { LoggedWeight } from 'Models';
import { Portal, Dialog } from 'react-native-paper';
import DialogButton from 'src/components/DialogButton';
import { DateTime } from 'luxon';
import { toString } from 'src/utils/error-result';

type Props = {
    entry?: LoggedWeight;
    onDismiss: () => void;
    onRemove: (entry: LoggedWeight) => Promise<any>;
};

function EntryOptionsDialog({ entry, onDismiss, onRemove }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <Portal>
            <Dialog visible={!!entry} onDismiss={onDismiss}>
                <Dialog.Title>
                    {entry && DateTime.fromISO(entry.timestamp).toLocaleString(DateTime.DATETIME_FULL)}
                </Dialog.Title>
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

export default EntryOptionsDialog;

const styles = StyleSheet.create({});

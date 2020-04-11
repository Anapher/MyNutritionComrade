import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DialogButton from './DialogButton';

type Props = Omit<React.ComponentProps<typeof DialogButton>, 'onPress'> & {
    onPress: () => Promise<void>;
};

const AsyncDialogButton = ({ onPress, loading, disabled, ...props }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <DialogButton
            {...props}
            disabled={disabled || isLoading}
            loading={loading || isLoading}
            onPress={async () => {
                setIsLoading(true);
                await onPress();
                setIsLoading(false);
            }}
        />
    );
};

export default AsyncDialogButton;

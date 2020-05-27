import React from 'react';
import { KeyboardAvoidingView, Platform, KeyboardAvoidingViewProps } from 'react-native';

type Props = KeyboardAvoidingViewProps & { children: React.ReactNode };

const WorkingKeyboardAvoidingView = (props: Props) => {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.select({ ios: 60, android: 78 })}
            behavior={'padding'}
            {...props}
        />
    );
};

export default WorkingKeyboardAvoidingView;

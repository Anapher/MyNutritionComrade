import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Headline, TextInput } from 'react-native-paper';

const styles = StyleSheet.create({
    textInput: {
        margin: 8,
        backgroundColor: 'transparent',
    },
});

function SignInScreen() {
    return (
        <View>
            <View
                style={{
                    alignItems: 'center',
                    paddingTop: 48,
                    paddingBottom: 8,
                }}
            >
                <Headline>SIGN IN</Headline>
            </View>
            <View style={{ margin: 8 }}>
                <TextInput
                    label="E-Mail Address"
                    style={styles.textInput}
                    autoCompleteType="email"
                    autoFocus
                    keyboardType="email-address"
                />
                <TextInput label="Password" style={styles.textInput} autoCompleteType="password" secureTextEntry />
                <Button
                    mode="contained"
                    onPress={() => console.log('Pressed')}
                    style={{ marginLeft: 16, marginRight: 16, marginTop: 16 }}
                >
                    Sign In
                </Button>
            </View>
        </View>
    );
}

export default SignInScreen;

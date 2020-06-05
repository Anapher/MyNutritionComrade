import { RootState } from 'MyNutritionComrade';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { RequestErrorResponse, toString } from 'src/utils/error-result';

const mapStateToProps = (state: RootState) => ({
    isLoading: state.auth.isSigningIn,
});

const dispatchProps = {
    googleSignIn: actions.googleSignInAsync.request,
};

type Props = typeof dispatchProps & ReturnType<typeof mapStateToProps>;

function SignInScreen({ isLoading, googleSignIn }: Props) {
    const [error, setError] = useState<undefined | RequestErrorResponse>();
    const theme = useTheme();

    const onSignIn = async () => {
        try {
            googleSignIn();
        } catch (error) {
            setError(error);
        }
    };

    return (
        <View style={styles.root}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>My Nutrition Comrade</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button icon="google" mode="contained" onPress={onSignIn}>
                    Sign in with Google
                </Button>
            </View>
            <View style={{ flex: 1 }}>
                {error && <Text style={{ color: theme.colors.error, margin: 16 }}>{toString(error)}</Text>}
            </View>
        </View>
    );
}

export default connect(mapStateToProps, dispatchProps)(SignInScreen);

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
        display: 'flex',
        flexDirection: 'column',
    },
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    titleContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
    },
    title: {
        fontSize: 30,
        fontWeight: '100',
        marginBottom: 36,
    },
});

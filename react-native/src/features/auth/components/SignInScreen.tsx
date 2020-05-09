import { RootState } from 'MyNutritionComrade';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { connect } from 'react-redux';
import * as actions from '../actions';

const mapStateToProps = (state: RootState) => ({
    isLoading: state.auth.isSigningIn,
});

const dispatchProps = {
    googleSignIn: actions.googleSignInAsync.request,
};

type Props = typeof dispatchProps & ReturnType<typeof mapStateToProps>;

function SignInScreen({ isLoading, googleSignIn }: Props) {
    return (
        <View style={styles.root}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>My Nutrition Comrade</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button icon="google" mode="contained" onPress={googleSignIn}>
                    Sign in with Google
                </Button>
            </View>
            <View style={{ flex: 1 }} />
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

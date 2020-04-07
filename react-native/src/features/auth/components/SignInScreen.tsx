import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Headline, TextInput, HelperText } from 'react-native-paper';
import { Formik, FormikHelpers } from 'formik';
import { SignInRequest } from 'AppModels';
import * as yup from 'yup';
import * as actions from '../actions';
import { connect } from 'react-redux';
import useAsyncFunction from 'src/hooks/use-async-function';
import { applyError } from 'src/utils/formik-helpers';

const styles = StyleSheet.create({
    textInput: {
        margin: 8,
        backgroundColor: 'transparent',
    },
});

const initialValues: SignInRequest = { userName: '', password: '', rememberMe: true };

const scheme = yup.object().shape({
    userName: yup.string().email('Please insert a valid email address.').required('E-mail is required!'),
    password: yup.string().required('Password is required!'),
});

const dispatchProps = {
    signIn: actions.signInAsync,
};

type Props = typeof dispatchProps;

function SignInScreen({ signIn }: Props) {
    const signInAction = useAsyncFunction(
        actions.signInAsync.request,
        actions.signInAsync.success,
        actions.signInAsync.failure,
    );

    const signInCallback = useCallback(
        async (values: SignInRequest, formikActions: FormikHelpers<SignInRequest>) => {
            const { setSubmitting } = formikActions;

            try {
                await signInAction!(values);
                // the view will automatically change when the user is authenticated
            } catch (error) {
                applyError(error, formikActions);
            } finally {
                setSubmitting(false);
            }
        },
        [signInAction],
    );

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
                <Formik<SignInRequest>
                    initialValues={initialValues}
                    validationSchema={scheme}
                    onSubmit={signInCallback}
                >
                    {({ handleSubmit, handleBlur, handleChange, values, isValid, isSubmitting, errors, status }) => (
                        <View>
                            <View>
                                <TextInput
                                    label="E-Mail Address"
                                    style={styles.textInput}
                                    autoCompleteType="email"
                                    autoFocus
                                    keyboardType="email-address"
                                    value={values.userName}
                                    onBlur={handleBlur('userName')}
                                    onChangeText={handleChange('userName')}
                                    disabled={isSubmitting}
                                    error={!!errors.userName}
                                />
                                {errors.userName && <HelperText type="error">{errors.userName}</HelperText>}
                            </View>
                            <View>
                                <TextInput
                                    label="Password"
                                    style={styles.textInput}
                                    value={values.password}
                                    onBlur={handleBlur('password')}
                                    onChangeText={handleChange('password')}
                                    autoCompleteType="password"
                                    secureTextEntry
                                    disabled={isSubmitting}
                                    error={!!errors.password}
                                />
                                {errors.password && <HelperText type="error">{errors.password}</HelperText>}
                            </View>
                            <Button
                                mode="contained"
                                onPress={handleSubmit}
                                disabled={!isValid || isSubmitting}
                                loading={isSubmitting}
                                style={{ marginLeft: 16, marginRight: 16, marginTop: 16 }}
                            >
                                Sign In
                            </Button>
                            <HelperText type="error" visible={!!status}>
                                {status}
                            </HelperText>
                        </View>
                    )}
                </Formik>
            </View>
        </View>
    );
}

export default connect(null, dispatchProps)(SignInScreen);

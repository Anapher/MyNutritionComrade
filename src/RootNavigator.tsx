import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootState } from 'MyNutritionComrade';
import { connect } from 'react-redux';
import SignInScreen from 'src/features/auth/components/SignInScreen';
import HomeScreen from './HomeScreen';

const Stack = createStackNavigator();

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isSignOut: state.auth.isSignOut,
});

type Props = ReturnType<typeof mapStateToProps>;

function RootNavigator({ isAuthenticated, isSignOut }: Props) {
    return (
        <Stack.Navigator>
            {isAuthenticated ? (
                <Stack.Screen name="SignIn" component={SignInScreen} />
            ) : (
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        // When logging out, a pop animation feels intuitive
                        animationTypeForReplace: isSignOut ? 'pop' : 'push',
                    }}
                />
            )}
        </Stack.Navigator>
    );
}

export default connect(mapStateToProps)(RootNavigator);

import { createStackNavigator } from '@react-navigation/stack';
import { RootState } from 'MyNutritionComrade';
import React from 'react';
import { IconButton } from 'react-native-paper';
import { connect } from 'react-redux';
import SignInScreen from 'src/features/auth/components/SignInScreen';
import ProductSearchHeader from './features/product-search/components/ProductSearchHeader';
import ProductSearch from './features/product-search/components/ProductSearchScreen';
import HomeScreen from './HomeScreen';
import { MealType } from 'Models';

const Stack = createStackNavigator();

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isSignOut: state.auth.isSignOut,
});

type Props = ReturnType<typeof mapStateToProps>;

export type RootStackParamList = {
    Home: undefined;
    SearchProduct: { mealType: MealType };
};

function RootNavigator({ isAuthenticated, isSignOut }: Props) {
    return (
        <Stack.Navigator>
            {!isAuthenticated ? (
                <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
            ) : (
                <>
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                            // When logging out, a pop animation feels intuitive
                            animationTypeForReplace: isSignOut ? 'pop' : 'push',
                            headerTitle: 'My Nutriton Comrade',
                            headerRight: () => <IconButton icon="account" size={26} onPress={() => {}} />,
                        }}
                    />
                    <Stack.Screen
                        name="SearchProduct"
                        component={ProductSearch}
                        options={({ route }) => ({
                            headerTitle: () => <ProductSearchHeader mealType={(route.params as any).mealType} />,
                            headerTitleContainerStyle: { flex: 1, marginHorizontal: 0, marginLeft: 60 },
                            headerTitleAlign: 'center',
                        })}
                    />
                </>
            )}
        </Stack.Navigator>
    );
}

export default connect(mapStateToProps)(RootNavigator);

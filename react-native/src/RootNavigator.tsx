import { createStackNavigator } from '@react-navigation/stack';
import { RootState } from 'MyNutritionComrade';
import React from 'react';
import { IconButton, Appbar } from 'react-native-paper';
import { connect } from 'react-redux';
import SignInScreen from 'src/features/auth/components/SignInScreen';
import ProductSearchHeader from './features/product-search/components/ProductSearchHeader';
import ProductSearch from './features/product-search/components/ProductSearchScreen';
import HomeScreen from './HomeScreen';
import { MealType } from 'Models';
import AddProduct from './features/product-create/components/AddProduct';
import AddProductHeader from './features/product-create/components/AddProductHeader';

const Stack = createStackNavigator();

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isSignOut: state.auth.isSignOut,
});

type Props = ReturnType<typeof mapStateToProps>;

export type RootStackParamList = {
    Home: undefined;
    SearchProduct: { mealType: MealType };
    AddProduct: undefined;
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
                            header: x => (
                                <Appbar.Header>
                                    <Appbar.Content title="My Nutriton Comrade" />
                                </Appbar.Header>
                            ),
                        }}
                    />
                    <Stack.Screen
                        name="SearchProduct"
                        component={ProductSearch}
                        options={({ route, navigation }) => ({
                            header: () => (
                                <ProductSearchHeader
                                    mealType={(route.params as any).mealType}
                                    navigation={navigation}
                                />
                            ),
                        })}
                    />
                    <Stack.Screen
                        name="AddProduct"
                        component={AddProduct}
                        options={({ navigation }) => ({
                            header: () => <AddProductHeader navigation={navigation} />,
                        })}
                    />
                </>
            )}
        </Stack.Navigator>
    );
}

export default connect(mapStateToProps)(RootNavigator);

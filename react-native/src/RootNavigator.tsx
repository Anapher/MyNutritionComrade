import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { BarCodeScanningResult } from 'expo-camera/build/Camera.types';
import {
    ConsumptionTime,
    PatchOperation,
    ProductContributionDto,
    ProductDto,
    ProductInfo,
    ProductProperties,
    ProductContributionStatus,
} from 'Models';
import { RootState, PagingResponse } from 'MyNutritionComrade';
import React from 'react';
import { Appbar } from 'react-native-paper';
import { connect } from 'react-redux';
import SignInScreen from 'src/features/auth/components/SignInScreen';
import BarcodeScanner from './features/barcode-scanner/BarcodeScanner';
import AddProduct from './features/product-add/components/AddProduct';
import ChangeProduct from './features/product-create/components/ChangeProduct';
import CreateProduct from './features/product-create/components/CreateProduct';
import ReviewChanges from './features/product-create/components/ReviewChanges';
import ProductSearchHeader from './features/product-search/components/ProductSearchHeader';
import ProductSearch from './features/product-search/components/ProductSearchScreen';
import VoteProductChanges from './features/product-vote-changes/components/VoteProductChanges';
import HomeScreen from './HomeScreen';
import ProductOverviewScreen from './features/product-overview/components/ProductOverviewScreen';

const Stack = createStackNavigator();

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    isSignOut: state.auth.isSignOut,
});

type Props = ReturnType<typeof mapStateToProps>;

export type RootStackParamList = {
    Home: undefined;
    SearchProduct: { consumptionTime: ConsumptionTime; date: string };
    CreateProduct: { initialValues?: Partial<ProductProperties> };
    ChangeProduct: { product: ProductDto };
    ReviewProductChanges: { product: ProductDto; changes: PatchOperation[][]; acceptChanges: () => void };
    ScanBarcode: {
        onBarcodeScanned: (
            result: BarCodeScanningResult,
            navigation: StackNavigationProp<RootStackParamList>,
        ) => Promise<boolean | void>;
    };
    AddProduct: { product: ProductInfo; volume?: number; onSubmit: (volume: number) => void };
    VoteProductChanges: {
        preloaded?: PagingResponse<ProductContributionDto>;
        filter?: ProductContributionStatus;
        product: ProductInfo;
    };
    ProductOverview: { product: ProductInfo };
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
                            header: (x) => (
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
                                    consumptionTime={(route.params as any).consumptionTime}
                                    navigation={navigation}
                                />
                            ),
                        })}
                    />
                    <Stack.Screen
                        name="CreateProduct"
                        initialParams={{ initialValues: {} }}
                        options={{
                            headerStyle: { backgroundColor: '#222' },
                        }}
                        component={CreateProduct}
                    />
                    <Stack.Screen name="ChangeProduct" component={ChangeProduct} />
                    <Stack.Screen name="ReviewProductChanges" component={ReviewChanges} />
                    <Stack.Screen
                        name="ScanBarcode"
                        component={BarcodeScanner}
                        options={{
                            headerShown: false,
                            animationTypeForReplace: 'pop',
                        }}
                    />
                    <Stack.Screen name="AddProduct" component={AddProduct} />
                    <Stack.Screen name="VoteProductChanges" component={VoteProductChanges} />
                    <Stack.Screen name="ProductOverview" component={ProductOverviewScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}

export default connect(mapStateToProps)(RootNavigator);

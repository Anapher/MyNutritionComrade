import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { BarCodeScanningResult } from 'expo-camera/build/Camera.types';
import {
    FoodPortionCreationDto,
    FoodPortionDto,
    MealCreationForm,
    PatchOperation,
    ProductContributionDto,
    ProductContributionStatus,
    ProductInfo,
    ProductProperties,
    ProductSearchConfig,
    Meal,
    FoodPortionMealDto,
    MealFoodPortionCreationDto,
    NutritionalInfo,
    FoodPortionItemDto,
} from 'Models';
import { PagingResponse, RootState } from 'MyNutritionComrade';
import React from 'react';
import { Appbar } from 'react-native-paper';
import { connect } from 'react-redux';
import SignInScreen from 'src/features/auth/components/SignInScreen';
import BarcodeScanner from './features/barcode-scanner/BarcodeScanner';
import CreateMealDialog from './features/meals/components/CreateMealDialog';
import Meals from './features/meals/components/Meals';
import AddProduct from './features/product-add/components/AddProduct';
import ChangeProduct from './features/product-create/components/ChangeProduct';
import CreateProduct from './features/product-create/components/CreateProduct';
import ReviewChanges from './features/product-create/components/ReviewChanges';
import ProductOverviewScreen from './features/product-overview/components/ProductOverviewScreen';
import ProductSearchHeader from './features/product-search/components/ProductSearchHeader';
import ProductSearch from './features/product-search/components/ProductSearchScreen';
import VoteProductChanges from './features/product-vote-changes/components/VoteProductChanges';
import Settings from './features/settings/components/Settings';
import HomeScreen from './HomeScreen';
import EditMealDialog from './features/meals/components/EditMealDialog';
import MealPortionDialog from './features/meals/components/MealPortionDialog';

const Stack = createStackNavigator();

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.token !== null,
});

type Props = ReturnType<typeof mapStateToProps>;

export type RootStackParamList = {
    Home: undefined;
    SearchProduct: {
        config: ProductSearchConfig;
        onCreated: (dto: FoodPortionCreationDto, foodPortion?: FoodPortionDto) => void;
    };
    CreateProduct: { initialValues?: Partial<ProductProperties> };
    ChangeProduct: { product: ProductInfo };
    ReviewProductChanges: { product: ProductInfo; changes: PatchOperation[][]; acceptChanges: () => void };
    ScanBarcode: {
        onBarcodeScanned: (
            result: BarCodeScanningResult,
            navigation: StackNavigationProp<RootStackParamList>,
        ) => Promise<boolean | void>;
    };
    AddProduct: {
        product: ProductInfo;
        servingType?: string;
        amount?: number;
        disableGoBack?: boolean;
        onSubmit: (value: number, servingType: string) => void;
    };
    VoteProductChanges: {
        preloaded?: PagingResponse<ProductContributionDto>;
        filter?: ProductContributionStatus;
        product: ProductInfo;
    };
    ProductOverview: { product: ProductInfo };
    Settings: {};
    CreateMeal: { initialValue?: Partial<MealCreationForm> };
    EditMeal: { meal: Meal };
    Meals: {};
    SelectMealPortion: {
        mealName: string;
        nutritionalInfo: NutritionalInfo;
        initialPortion?: number;
        disableGoBack?: boolean;
        onSubmit: (newPortion: number) => void;
    };
};

function RootNavigator({ isAuthenticated }: Props) {
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
                            animationTypeForReplace: isAuthenticated ? 'push' : 'pop',
                            header: ({ navigation }) => (
                                <Appbar.Header>
                                    <Appbar.Content title="My Nutriton Comrade" />
                                    <Appbar.Action icon="settings" onPress={() => navigation.navigate('Settings')} />
                                </Appbar.Header>
                            ),
                        }}
                    />
                    <Stack.Screen
                        name="SearchProduct"
                        component={ProductSearch}
                        options={({ route, navigation }) => ({
                            header: () => <ProductSearchHeader route={route as any} navigation={navigation} />,
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
                    <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
                    <Stack.Screen name="CreateMeal" component={CreateMealDialog} />
                    <Stack.Screen name="EditMeal" component={EditMealDialog} />
                    <Stack.Screen name="Meals" component={Meals} />
                    <Stack.Screen name="SelectMealPortion" component={MealPortionDialog} />
                </>
            )}
        </Stack.Navigator>
    );
}

export default connect(mapStateToProps)(RootNavigator);

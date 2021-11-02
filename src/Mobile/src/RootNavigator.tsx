import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PayloadAction } from '@reduxjs/toolkit';
import { BarCodeScanningResult } from 'expo-camera';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import SimpleIconButton from './components/SimpleIconButton';
import LoginScreen from './features/auth/components/LoginScreen';
import LoginScreenPassword from './features/auth/components/LoginScreenPassword';
import ScanProductBarCode from './features/barcode-scanner/components/ScanProductBarCode';
import CreateMeal from './features/meal-create/components/CreateMeal';
import EditMeal from './features/meal-create/components/EditMeal';
import { MealForm } from './features/meal-create/validation';
import MealsOverview from './features/meals-overview/components/MealsOverview';
import AddProduct from './features/product-add/components/AddProduct';
import ProductContributionsScreen from './features/product-contributions/components/ProductContributionsScreen';
import AddLabelScreen from './features/product-create/components/AddLabelScreen';
import ChangeProduct from './features/product-create/components/ChangeProduct';
import ConfigureServingsScreen from './features/product-create/components/ConfigureServingsScreen';
import CreateProduct from './features/product-create/components/CreateProduct';
import ReviewChangesScreen from './features/product-create/components/ReviewChangesScreen';
import { ProductLabelViewModel } from './features/product-create/types';
import AddCustomProductScreen from './features/product-custom/components/AddCustomProductScreen';
import ProductOverviewScreen from './features/product-overview/components/ProductOverviewScreen';
import ProductSearchScreen from './features/product-search/components/ProductSearchScreen';
import { SearchScreenConfig } from './features/product-search/reducer';
import IndexesOverview from './features/settings/components/indexes/IndexesOverview';
import NutritionCalories from './features/settings/components/nutrition-calories/NutritionCalories';
import NutritionProtein from './features/settings/components/nutrition-protein/NutritionProtein';
import PersonalInfo from './features/settings/components/personal-info/PersonalInfo';
import SettingsRoot from './features/settings/components/SettingsRoot';
import Weight from './features/settings/components/weight/Weight';
import { selectIsFirstStart, selectSettingsLoaded } from './features/settings/selectors';
import WelcomeScreen from './features/welcome/WelcomeScreen';
import HomeScreen from './HomeScreen';
import {
   FoodPortion,
   FoodPortionCustom,
   Meal,
   Product,
   ProductContributionStatusDto,
   ProductOperationsGroup,
   ProductProperties,
} from './types';
import { PayloadActionTemplate } from './utils/redux-utils';

const Stack = createNativeStackNavigator();

export type ProductSearchCompletedAction = PayloadActionTemplate<{
   foodPortion: FoodPortion;
}>;

export type AddProductCompletedAction = PayloadActionTemplate<{
   amount: number;
   servingType: string;
}>;

export type BarcodeScannedAction = PayloadAction<{
   result: BarCodeScanningResult;
}>;

export type RootNavigatorParamList = {
   Home: undefined;
   Welcome: undefined;
   SearchProduct: {
      config: SearchScreenConfig;
      onCreatedAction: ProductSearchCompletedAction;
      onCreatedPop: number;
   };
   AddProduct: {
      product: Product;
      servingType?: string;
      amount?: number;

      submitTitle: string;
      onSubmitPop: number;
      onSubmitAction: AddProductCompletedAction;
   };
   ScanBarcode: {
      onCodeScanned: (result: BarCodeScanningResult) => void;
      showCodeScannedAnimation?: boolean;
      keepOpen?: boolean;
   };
   Settings: undefined;
   SettingsPersonalInfo: undefined;
   SettingsWeight: undefined;
   SettingsNutritionGoalProtein: undefined;
   SettingsNutritionGoalCalories: undefined;
   SettingsNutritionGoalDistribution: undefined;
   CreateProduct: {
      initialValue: Partial<ProductProperties>;
   };
   ProductEditorAddLabel: {
      initialValue: Partial<ProductLabelViewModel>;
      availableLanguages: string[];
      onDelete?: () => void;
      mode: 'create' | 'change';
      onSubmit: (label: ProductLabelViewModel) => void;
   };
   ProductEditorServings: {
      form: UseFormReturn<ProductProperties>;
   };
   Login: { onAuthenticated?: () => void };
   LoginPassword: { onAuthenticated?: () => void; emailAddress: string };
   ProductOverview: { product: Product; contributionStatus?: ProductContributionStatusDto | null };
   ChangeProduct: { product: Product };
   ReviewProductChanges: { product: Product; changes: ProductOperationsGroup[] };
   ProductContributions: { product: Product };
   IndexesOverview: undefined;
   AddCustomProduct: { initialValues?: Partial<FoodPortionCustom>; onSubmit: (value: FoodPortionCustom) => void };
   MealsOverview: undefined;
   CreateMeal: { initialValue?: Partial<MealForm> } | undefined;
   EditMeal: { meal: Meal };
};

export default function RootNavigator() {
   const settingsLoaded = useSelector(selectSettingsLoaded);
   const isFirstStart = useSelector(selectIsFirstStart);

   const { t } = useTranslation();

   if (!settingsLoaded) return null;

   return (
      <Stack.Navigator initialRouteName={isFirstStart ? 'Welcome' : 'Home'}>
         <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false, animationTypeForReplace: 'pop' }}
         />
         <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
               headerTitle: 'My Nutrition Comrade',
               headerRight: ({}) => <SimpleIconButton icon="cog" onPress={() => navigation.navigate('Settings')} />,
            })}
         />
         <Stack.Screen name="SearchProduct" component={ProductSearchScreen} options={{ headerShadowVisible: false }} />
         <Stack.Screen name="AddProduct" component={AddProduct} />
         <Stack.Screen
            name="ScanBarcode"
            component={ScanProductBarCode}
            options={{
               headerShown: false,
               animationTypeForReplace: 'pop',
            }}
         />
         <Stack.Screen
            name="Settings"
            component={SettingsRoot}
            options={{
               title: 'Settings',
            }}
         />
         <Stack.Screen
            name="SettingsPersonalInfo"
            component={PersonalInfo}
            options={{ headerTitle: t('settings.personal_info.title') }}
         />
         <Stack.Screen name="SettingsWeight" component={Weight} options={{ headerTitle: t('settings.weight.title') }} />
         <Stack.Screen
            name="SettingsNutritionGoalProtein"
            component={NutritionProtein}
            options={{ headerTitle: t('settings.protein.title') }}
         />
         <Stack.Screen
            name="SettingsNutritionGoalCalories"
            component={NutritionCalories}
            options={{ headerTitle: t('settings.calories.title') }}
         />
         <Stack.Screen
            name="CreateProduct"
            component={CreateProduct}
            options={{ headerTitle: t('create_product.title') }}
         />
         <Stack.Screen name="ProductEditorAddLabel" component={AddLabelScreen} />
         <Stack.Screen
            name="ProductEditorServings"
            component={ConfigureServingsScreen}
            options={{ headerTitle: t('product_properties.servings') }}
         />
         <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerTitle: t('auth.title'), presentation: 'modal' }}
         />
         <Stack.Screen
            name="LoginPassword"
            component={LoginScreenPassword}
            options={{ headerTitle: t('auth.title'), presentation: 'modal' }}
         />
         <Stack.Screen name="ProductOverview" component={ProductOverviewScreen} />
         <Stack.Screen
            name="ChangeProduct"
            component={ChangeProduct}
            options={{ headerTitle: t('change_product.title') }}
         />
         <Stack.Screen name="ReviewProductChanges" component={ReviewChangesScreen} />
         <Stack.Screen
            name="ProductContributions"
            component={ProductContributionsScreen}
            options={{ headerTitle: t('product_contributions.title') }}
         />
         <Stack.Screen
            name="IndexesOverview"
            component={IndexesOverview}
            options={{ headerTitle: t('indexes.title') }}
         />
         <Stack.Screen
            name="AddCustomProduct"
            component={AddCustomProductScreen}
            options={{ headerTitle: t('add_custom_product.title') }}
         />
         <Stack.Screen name="MealsOverview" component={MealsOverview} options={{ headerTitle: t('meals') }} />
         <Stack.Screen name="CreateMeal" component={CreateMeal} />
         <Stack.Screen name="EditMeal" component={EditMeal} />
      </Stack.Navigator>
   );
}

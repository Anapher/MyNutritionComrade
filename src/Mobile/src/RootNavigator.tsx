import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PayloadAction } from '@reduxjs/toolkit';
import { BarCodeScanningResult } from 'expo-camera';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Appbar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import ScanProductBarCode from './features/barcode-scanner/components/ScanProductBarCode';
import AddProduct from './features/product-add/components/AddProduct';
import ProductNotFound from './features/product-create/components/ProductNotFound';
import ProductSearchHeader from './features/product-search/components/ProductSearchHeader';
import ProductSearchScreen from './features/product-search/components/ProductSearchScreen';
import NutritionCalories from './features/settings/components/nutrition-calories/NutritionCalories';
import NutritionProtein from './features/settings/components/nutrition-protein/NutritionProtein';
import NutritionDistribution from './features/settings/components/nutrition-distribution/NutritionDistribution';
import PersonalInfo from './features/settings/components/personal-info/PersonalInfo';
import SettingsRoot from './features/settings/components/SettingsRoot';
import Weight from './features/settings/components/weight/Weight';
import { selectIsFirstStart, selectSettingsLoaded } from './features/settings/selectors';
import WelcomeScreen from './features/welcome/WelcomeScreen';
import HomeScreen from './HomeScreen';
import { ProductSearchConfig } from './services/search-engine/types';
import { FoodPortion, Product } from './types';

const Stack = createNativeStackNavigator();

export type ProductSearchCompletedAction = PayloadAction<{
   foodPortion: FoodPortion;
   [x: string]: any;
}>;

export type AddProductCompletedAction = PayloadAction<{
   amount: number;
   servingType: string;
   [x: string]: any;
}>;

export type BarcodeScannedAction = PayloadAction<{
   result: BarCodeScanningResult;
}>;

export type RootNavigatorParamList = {
   Home: undefined;
   Welcome: undefined;
   SearchProduct: {
      config: ProductSearchConfig;
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
      onBarcodeScannedAction: BarcodeScannedAction;
   };
   ProductNotFound: undefined;
   Settings: undefined;
   SettingsPersonalInfo: undefined;
   SettingsWeight: undefined;
   SettingsNutritionGoalProtein: undefined;
   SettingsNutritionGoalCalories: undefined;
   SettingsNutritionGoalDistribution: undefined;
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
            options={{
               header: ({ navigation }) => (
                  <Appbar.Header>
                     <Appbar.Content title="My Nutrition Comrade" />
                     <Appbar.Action icon="cog" onPress={() => navigation.navigate('Settings')} />
                  </Appbar.Header>
               ),
            }}
         />
         <Stack.Screen
            name="SearchProduct"
            component={ProductSearchScreen}
            options={({ route, navigation }) => ({
               header: () => <ProductSearchHeader route={route as any} navigation={navigation} />,
            })}
         />
         <Stack.Screen name="AddProduct" component={AddProduct} />
         <Stack.Screen
            name="ScanBarcode"
            component={ScanProductBarCode}
            options={{
               headerShown: false,
               animationTypeForReplace: 'pop',
            }}
         />
         <Stack.Screen name="ProductNotFound" component={ProductNotFound} />
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
            options={{ headerTitle: t('settings.protein.title') }}
         />
         <Stack.Screen
            name="SettingsNutritionGoalDistribution"
            component={NutritionDistribution}
            options={{ headerTitle: t('settings.protein.title') }}
         />
      </Stack.Navigator>
   );
}

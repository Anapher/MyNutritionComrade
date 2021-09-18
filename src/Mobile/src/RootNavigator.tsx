import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PayloadAction } from '@reduxjs/toolkit';
import React from 'react';
import { Appbar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import AddProduct from './features/product-add/components/AddProduct';
import ProductSearchHeader from './features/product-search/components/ProductSearchHeader';
import ProductSearchScreen from './features/product-search/components/ProductSearchScreen';
import { selectIsFirstStart, selectSettingsLoaded } from './features/settings/selectors';
import WelcomeScreen from './features/welcome/WelcomeScreen';
import HomeScreen from './HomeScreen';
import { ProductSearchConfig } from './services/search-engine/types';
import { FoodPortion, FoodPortionCreationDto, Product } from './types';

const Stack = createNativeStackNavigator();

export type ProductSearchCompletedAction = PayloadAction<{
   creationDto: FoodPortionCreationDto;
   [x: string]: any;
}>;

export type AddProductCompletedAction = PayloadAction<{
   amount: number;
   servingType: string;
   [x: string]: any;
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

      onSubmitPop: number;
      onSubmitAction: AddProductCompletedAction;
   };
};

export default function RootNavigator() {
   const settingsLoaded = useSelector(selectSettingsLoaded);
   const isFirstStart = useSelector(selectIsFirstStart);

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
      </Stack.Navigator>
   );
}

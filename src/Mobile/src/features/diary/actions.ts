import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createAction } from '@reduxjs/toolkit';
import { BarCodeScanningResult } from 'expo-camera';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ConsumptionTime, FoodPortion, FoodPortionItem, FoodPortionMeal, FoodPortionProduct } from 'src/types';

export type ConsumptionId = {
   date: string;
   time: ConsumptionTime;
   foodId: string;
};

export type ConsumptionPayload<T extends FoodPortion = FoodPortion> = {
   date: string;
   time: ConsumptionTime;
   foodPortion: T;
};

export type AddConsumptionPayload = ConsumptionPayload & {
   append: boolean;
};

export const addConsumption = createAction<AddConsumptionPayload>('diary/add-consumption');
export const setConsumption = createAction<ConsumptionPayload>('diary/set-consumption');
export const removeConsumption = createAction<ConsumptionId>('diary/remove-consumption');

export type SetConsumptionDialogActionPayload = ConsumptionPayload<FoodPortionProduct> & {
   amount: number;
   servingType: string;
};

export const setConsumptionDialogAction = createAction<SetConsumptionDialogActionPayload>(
   'diary/set-consumption-dialog-action',
);

export type MealSetItemPayload = ConsumptionPayload<FoodPortionItem> & {
   meal: FoodPortionMeal;
};

export const setMealItem = createAction<MealSetItemPayload>('diary/meal-set-item');

export type MealChangeItemAmountPayload = MealSetItemPayload & {
   amount: number;
   servingType: string;
};

export const changeMealItemAmount = createAction<MealChangeItemAmountPayload>('diary/meal-change-item-amount');

export type BarcodeScannedAddProductPayload = {
   date: string;
   time: ConsumptionTime;
   result: BarCodeScanningResult;
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
};

export const barcodeScannedAddProduct = createAction<BarcodeScannedAddProductPayload>(
   'diary/barcode-scanned-add-product',
);

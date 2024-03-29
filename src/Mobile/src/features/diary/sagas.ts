import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import getDatabase from 'src/services/sqlite/database-instance';
import {
   fetchConsumedPortionsOfDay,
   removeConsumedPortion,
   setConsumedPortion,
} from 'src/services/sqlite/diary-repository';
import { SQLiteDatabase } from 'src/services/sqlite/types';
import { ConsumedPortion, Product } from 'src/types';
import { getFoodPortionId, mergeFoodPortions } from 'src/utils/food-portion-utils';
import { selectProducts } from '../repo-manager/selectors';
import {
   addConsumption,
   AddConsumptionPayload,
   barcodeScannedAddProduct,
   BarcodeScannedAddProductPayload,
   changeMealItemAmount,
   ConsumptionId,
   ConsumptionPayload,
   MealChangeItemAmountPayload,
   MealSetItemPayload,
   removeConsumption,
   setConsumption,
   setConsumptionDialogAction,
   SetConsumptionDialogActionPayload,
   setMealItem,
} from './actions';
import { selectedDateLoaded, setSelectedDate } from './reducer';
import { getSelectedDate, selectConsumedPortions } from './selectors';
import { selectedProductAmount } from '../product-search/actions';
import i18next from 'src/services/i18n';
import { Alert } from 'react-native';
import { createActionTemplate } from 'src/utils/redux-utils';

function* loadSelectedDate({ payload }: PayloadAction<string>) {
   const database: SQLiteDatabase = yield call(getDatabase);
   const result: ConsumedPortion[] = yield call(fetchConsumedPortionsOfDay, database, payload);

   yield put(selectedDateLoaded(result));
}

function* onAddConsumption({ payload: { date, time, append, foodPortion } }: PayloadAction<AddConsumptionPayload>) {
   if (append) {
      const consumedFood: ConsumedPortion[] | null = yield select(selectConsumedPortions);
      const existing = consumedFood?.find(
         (x) => x.date === date && x.time === time && getFoodPortionId(x.foodPortion) === getFoodPortionId(foodPortion),
      );

      if (existing) {
         foodPortion = mergeFoodPortions(foodPortion, existing.foodPortion);
      }
   }

   yield call(onSetConsumption, setConsumption({ foodPortion: foodPortion, date, time }));
}

function* onSetConsumption({ payload: { date, time, foodPortion: creationDto } }: PayloadAction<ConsumptionPayload>) {
   const database: SQLiteDatabase = yield call(getDatabase);
   yield call(setConsumedPortion, database, date, time, creationDto);

   yield call(refreshCurrentDate);
}

function* onRemoveConsumption({ payload: { date, time, foodId } }: PayloadAction<ConsumptionId>) {
   const database: SQLiteDatabase = yield call(getDatabase);
   yield call(removeConsumedPortion, database, date, time, foodId);

   yield call(refreshCurrentDate);
}

function* refreshCurrentDate() {
   const selectedDate: string | null = yield select(getSelectedDate);
   if (selectedDate) {
      yield call(loadSelectedDate, setSelectedDate(selectedDate));
   }
}

function* onSetConsumptionDialogAction({
   payload: { date, time, amount, servingType, foodPortion },
}: PayloadAction<SetConsumptionDialogActionPayload>) {
   yield put(setConsumption({ date, time, foodPortion: { ...foodPortion, amount, servingType } }));
}

function* onChangeMealItemAmount({
   payload: { meal, date, time, foodPortion, amount, servingType },
}: PayloadAction<MealChangeItemAmountPayload>) {
   yield put(
      setConsumption({
         date,
         time,
         foodPortion: {
            ...meal,
            items: meal.items.map((x) =>
               getFoodPortionId(x) === getFoodPortionId(foodPortion) ? { ...foodPortion, amount, servingType } : x,
            ),
         },
      }),
   );
}

function* onSetMealItem({ payload: { date, time, foodPortion, meal } }: PayloadAction<MealSetItemPayload>) {
   yield put(
      setConsumption({
         date,
         time,
         foodPortion: {
            ...meal,
            items: meal.items.map((x) => (getFoodPortionId(x) === getFoodPortionId(foodPortion) ? foodPortion : x)),
         },
      }),
   );
}

function* onBarcodeScannedAction({
   payload: { result, date, time, navigation },
}: PayloadAction<BarcodeScannedAddProductPayload>) {
   const products: Product[] | undefined = yield select(selectProducts);
   if (products) {
      const product = Object.values(products).find((x) => x.code === result.data);
      if (product) {
         navigation.replace('AddProduct', {
            product,
            onSubmitPop: 1,
            submitTitle: i18next.t('common:add'),
            onSubmitAction: createActionTemplate(selectedProductAmount, {
               product,
               completedAction: createActionTemplate(addConsumption, { date, time, append: true }),
            }),
         });
         return;
      }
   }

   navigation.goBack();

   const handleCreateProduct = () => {
      navigation.push('CreateProduct', { initialValue: { code: result.data } });
   };

   Alert.alert(
      i18next.t('barcode_scanner.product_not_found'),
      i18next.t('barcode_scanner.product_not_found_message'),
      [
         { text: i18next.t('barcode_scanner.add_product'), style: 'default', onPress: handleCreateProduct },
         { text: i18next.t('barcode_scanner.go_back'), style: 'cancel' },
      ],
      { cancelable: true },
   );
}

function* diarySaga() {
   yield takeEvery(setSelectedDate, loadSelectedDate);
   yield takeEvery(addConsumption, onAddConsumption);
   yield takeEvery(setConsumption, onSetConsumption);
   yield takeEvery(setConsumptionDialogAction, onSetConsumptionDialogAction);
   yield takeEvery(removeConsumption, onRemoveConsumption);
   yield takeEvery(barcodeScannedAddProduct, onBarcodeScannedAction);
   yield takeEvery(changeMealItemAmount, onChangeMealItemAmount);
   yield takeEvery(setMealItem, onSetMealItem);
}

export default diarySaga;

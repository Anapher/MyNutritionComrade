import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ProductFoodPortionView } from 'src/components-domain/FoodPortionView';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ConsumedPortion } from 'src/types';
import { getFoodPortionId } from 'src/utils/food-portion-utils';
import { removeConsumption, setConsumptionDialogAction } from '../actions';

type Props = {
   consumed: ConsumedPortion;
};

export default function ConsumedFoodItem({ consumed: { foodPortion, date, time } }: Props) {
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
   const dispatch = useDispatch();
   const { t } = useTranslation();
   const { showActionSheetWithOptions } = useActionSheet();

   const handleRemove = () => {
      dispatch(removeConsumption({ date, time, foodId: getFoodPortionId(foodPortion) }));
   };

   switch (foodPortion.type) {
      case 'product':
         const handleChangeProductAmount = () => {
            navigation.navigate('AddProduct', {
               submitTitle: t('change'),
               product: foodPortion.product,
               amount: foodPortion.amount,
               servingType: foodPortion.servingType,
               onSubmitPop: 1,
               onSubmitAction: setConsumptionDialogAction({
                  amount: foodPortion.amount,
                  servingType: foodPortion.servingType,
                  date,
                  time,
                  foodPortion,
               }),
            });
         };

         const handleShowOptions = () => {
            showActionSheetWithOptions(
               {
                  title: t('product_label', { product: foodPortion.product }),
                  options: [
                     t('add_product.show_product'),
                     t('consumption_actions.change_amount'),
                     t('common:remove'),
                     t('common:cancel'),
                  ],
                  cancelButtonIndex: 3,
                  destructiveButtonIndex: 2,
               },
               (selectedIndex) => {
                  switch (selectedIndex) {
                     case 0:
                        navigation.push('ProductOverview', { product: foodPortion.product });
                        break;
                     case 1:
                        handleChangeProductAmount();
                        break;
                     case 2:
                        handleRemove();
                        break;
                     default:
                        break;
                  }
               },
            );
         };

         return (
            <ProductFoodPortionView
               foodPortion={foodPortion}
               onPress={handleChangeProductAmount}
               onLongPress={handleShowOptions}
            />
         );
      default:
         return null;
   }
}

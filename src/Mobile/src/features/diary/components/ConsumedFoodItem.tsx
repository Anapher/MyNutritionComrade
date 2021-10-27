import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ProductFoodPortionView } from 'src/components-domain/FoodPortionView';
import useActionSheetWrapper, { CancelButton } from 'src/hooks/useActionSheetWrapper';
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
   const showActionSheet = useActionSheetWrapper();

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
            showActionSheet(
               [
                  {
                     label: t('add_product.show_product'),
                     onPress: () => navigation.push('ProductOverview', { product: foodPortion.product }),
                  },
                  {
                     label: t('consumption_actions.change_amount'),
                     onPress: () => handleChangeProductAmount(),
                  },
                  {
                     label: t('common:remove'),
                     onPress: () => handleRemove(),
                     destructive: true,
                  },
                  CancelButton(),
               ],
               {
                  title: t('product_label', { product: foodPortion.product }),
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

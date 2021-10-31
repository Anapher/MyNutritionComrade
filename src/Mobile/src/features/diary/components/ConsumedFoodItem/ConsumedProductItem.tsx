import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProductFoodPortionView } from 'src/components-domain/FoodPortionView';
import useActionSheetWrapper, { CancelButton } from 'src/hooks/useActionSheetWrapper';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { FoodPortionProduct } from 'src/types';
import { setConsumptionDialogAction } from '../../actions';
import { ConsumedFoodItemProps } from './types';

export default function ConsumedProductItem({
   consumed: { foodPortion, date, time },
   onRemove,
}: ConsumedFoodItemProps<FoodPortionProduct>) {
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
   const { t } = useTranslation();
   const showActionSheet = useActionSheetWrapper();

   const handleChangeAmount = () => {
      navigation.navigate('AddProduct', {
         submitTitle: t('common:change'),
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
               onPress: () => handleChangeAmount(),
            },
            {
               label: t('common:remove'),
               onPress: onRemove,
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
      <ProductFoodPortionView foodPortion={foodPortion} onPress={handleChangeAmount} onLongPress={handleShowOptions} />
   );
}

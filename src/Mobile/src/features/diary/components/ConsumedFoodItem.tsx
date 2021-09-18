import { NavigationProp, useNavigation } from '@react-navigation/core';
import React from 'react';
import { ProductFoodPortionView } from 'src/components-domain/FoodPortionView';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ConsumedPortion } from 'src/types';
import { mapFoodPortionDtoCreationDto } from 'src/utils/food-creation-utils';
import { setConsumptionDialogAction } from '../actions';

type Props = {
   consumed: ConsumedPortion;
};

export default function ConsumedFoodItem({ consumed: { foodPortion, date, time } }: Props) {
   const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();

   switch (foodPortion.type) {
      case 'product':
         const handleChangeProductAmount = () => {
            navigation.navigate('AddProduct', {
               product: foodPortion.product,
               amount: foodPortion.amount,
               servingType: foodPortion.servingType,
               onSubmitPop: 1,
               onSubmitAction: setConsumptionDialogAction({
                  amount: foodPortion.amount,
                  servingType: foodPortion.servingType,
                  date,
                  time,
                  creationDto: mapFoodPortionDtoCreationDto(foodPortion) as any,
               }),
            });
         };

         return <ProductFoodPortionView foodPortion={foodPortion} onPress={handleChangeProductAmount} />;
      default:
         return null;
   }
}

import { NavigationProp, useNavigation } from '@react-navigation/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ProductFoodPortionView } from 'src/components-domain/FoodPortionView';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { ConsumedPortion } from 'src/types';
import { getFoodPortionId } from 'src/utils/food-portion-utils';
import { removeConsumption, setConsumptionDialogAction } from '../actions';
import { ShowOptionsInfo } from './FoodPortionDialog';

type Props = {
   consumed: ConsumedPortion;
   showOptions: (options: ShowOptionsInfo) => void;
};

export default function ConsumedFoodItem({ consumed: { foodPortion, date, time }, showOptions }: Props) {
   const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();
   const dispatch = useDispatch();

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
                  creationDto: foodPortion,
               }),
            });
         };

         const handleShowOptions = () => {
            showOptions({
               foodPortion,
               handleRemove: () => dispatch(removeConsumption({ date, time, foodId: getFoodPortionId(foodPortion) })),
            });
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

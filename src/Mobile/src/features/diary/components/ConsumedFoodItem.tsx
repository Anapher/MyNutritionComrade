import React from 'react';
import { useDispatch } from 'react-redux';
import InteractiveCustomItem from 'src/components-domain/FoodPortionItem/InteractiveCustomItem';
import InteractiveMealItem from 'src/components-domain/FoodPortionItem/InteractiveMealItem';
import InteractiveProductItem from 'src/components-domain/FoodPortionItem/InteractiveProductItem';
import { ConsumedPortion } from 'src/types';
import { getFoodPortionId } from 'src/utils/food-portion-utils';
import { createActionTemplate } from 'src/utils/redux-utils';
import {
   changeMealItemAmount,
   removeConsumption,
   setConsumption,
   setConsumptionDialogAction,
   setMealItem,
} from '../actions';

type Props = {
   consumed: ConsumedPortion;
};

export default function ConsumedFoodItem({ consumed }: Props) {
   const dispatch = useDispatch();
   const { date, time, foodPortion } = consumed;

   const handleRemove = () => {
      dispatch(removeConsumption({ date, time, foodId: getFoodPortionId(foodPortion) }));
   };

   switch (foodPortion.type) {
      case 'product':
         return (
            <InteractiveProductItem
               foodPortion={foodPortion}
               onRemove={handleRemove}
               changeAmountAction={createActionTemplate(setConsumptionDialogAction, {
                  date,
                  time,
                  foodPortion,
               })}
            />
         );
      case 'custom':
         return (
            <InteractiveCustomItem
               foodPortion={foodPortion}
               changeAction={createActionTemplate(setConsumption, { date, time })}
               onRemove={handleRemove}
            />
         );
      case 'meal':
         return (
            <InteractiveMealItem
               foodPortion={foodPortion}
               changeAction={createActionTemplate(setConsumption, { date, time })}
               onRemove={handleRemove}
               changeMealItemAmountAction={createActionTemplate(changeMealItemAmount, {
                  date,
                  time,
                  meal: foodPortion,
               })}
               changeMealItemAction={createActionTemplate(setMealItem, { date, time, meal: foodPortion })}
            />
         );
      default:
         return null;
   }
}

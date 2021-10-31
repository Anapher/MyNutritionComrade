import React from 'react';
import { useDispatch } from 'react-redux';
import { ConsumedPortion } from 'src/types';
import { getFoodPortionId } from 'src/utils/food-portion-utils';
import { removeConsumption } from '../../actions';
import ConsumedCustomItem from './ConsumedCustomItem';
import ConsumedProductItem from './ConsumedProductItem';

type Props = {
   consumed: ConsumedPortion;
};

export default function ConsumedFoodItem({ consumed }: Props) {
   const dispatch = useDispatch();
   const { date, time, foodPortion } = consumed;

   const handleRemove = () => {
      dispatch(removeConsumption({ date, time, foodId: getFoodPortionId(foodPortion) }));
   };

   switch (consumed.foodPortion.type) {
      case 'product':
         return (
            <ConsumedProductItem
               consumed={{ ...consumed, foodPortion: consumed.foodPortion }}
               onRemove={handleRemove}
            />
         );
      case 'custom':
         return (
            <ConsumedCustomItem consumed={{ ...consumed, foodPortion: consumed.foodPortion }} onRemove={handleRemove} />
         );
      default:
         return null;
   }
}

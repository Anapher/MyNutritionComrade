import React from 'react';
import { ProductFoodPortionView } from 'src/components-domain/FoodPortionView';
import { ConsumedPortion } from 'src/types';

type Props = {
   consumed: ConsumedPortion;
};

export default function ConsumedFoodItem({ consumed: { foodPortion } }: Props) {
   switch (foodPortion.type) {
      case 'product':
         return (
            <ProductFoodPortionView
               foodPortion={foodPortion}
               onPress={(executeEdit) => {}}
               onLongPress={(executeEdit, handleRemove) => {}}
               onEdit={(creationDto) => {}}
               onRemove={() => {}}
            />
         );
      default:
         return null;
   }
}

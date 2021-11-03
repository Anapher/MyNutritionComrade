import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import useActionSheetWrapper, { CancelButton } from 'src/hooks/useActionSheetWrapper';
import { FoodPortion, FoodPortionMeal } from 'src/types';
import { getFoodPortionId } from 'src/utils/food-portion-utils';
import { PayloadActionTemplate } from 'src/utils/redux-utils';
import InteractiveCustomItem from './InteractiveCustomItem';
import InteractiveProductItem from './InteractiveProductItem';
import MealPortionView from './MealPortionView';

type Props = {
   foodPortion: FoodPortionMeal;
   onRemove: () => void;
   changeAction: PayloadActionTemplate<{ foodPortion: FoodPortion }>;
   changeMealItemAmountAction: PayloadActionTemplate<{ foodPortion: FoodPortion; amount: number; servingType: string }>;
   changeMealItemAction: PayloadActionTemplate<{ foodPortion: FoodPortion }>;
};

export default function InteractiveMealItem({
   onRemove,
   foodPortion,
   changeAction,
   changeMealItemAmountAction,
   changeMealItemAction,
}: Props) {
   const { t } = useTranslation();
   const showActionSheet = useActionSheetWrapper();
   const dispatch = useDispatch();

   const handleShowOptions = () => {
      showActionSheet(
         [
            {
               label: t('common:remove'),
               onPress: onRemove,
               destructive: true,
            },
            CancelButton(),
         ],
         {
            title: foodPortion.mealName,
         },
      );
   };

   const handleChange = (changedValues: Partial<FoodPortionMeal>) => {
      const updatedFoodPortion = { ...foodPortion, ...changedValues };
      if (updatedFoodPortion.items.length === 0) {
         onRemove();
         return;
      }

      dispatch({
         ...changeAction,
         payload: { ...changeAction.payload, foodPortion: updatedFoodPortion },
      });
   };

   const handleRemove = (foodPortionId: string) => {
      handleChange({ items: foodPortion.items.filter((x) => getFoodPortionId(x) !== foodPortionId) });
   };

   return (
      <MealPortionView
         foodPortion={foodPortion}
         onHeaderPress={() => {}}
         onHeaderLongPress={handleShowOptions}
         renderItem={(item) => {
            switch (item.type) {
               case 'product':
                  return (
                     <InteractiveProductItem
                        foodPortion={item}
                        onRemove={() => handleRemove(getFoodPortionId(item))}
                        changeAmountAction={{
                           ...changeMealItemAmountAction,
                           payload: { ...changeMealItemAmountAction.payload, foodPortion: item },
                        }}
                     />
                  );
               case 'custom':
                  return (
                     <InteractiveCustomItem
                        foodPortion={item}
                        onRemove={() => handleRemove(getFoodPortionId(item))}
                        changeAction={changeMealItemAction}
                     />
                  );
            }
         }}
      />
   );
}

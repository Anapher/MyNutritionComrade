import { ConsumedPortion, FoodPortion } from 'src/types';

export type ConsumedFoodItemProps<T extends FoodPortion> = {
   consumed: ConsumedPortion<T>;
   onRemove: () => void;
};

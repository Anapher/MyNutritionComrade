import { createAction } from '@reduxjs/toolkit';
import { ConsumptionTime, FoodPortionCreationDto, ProductFoodPortionCreationDto } from 'src/types';

export type ConsumptionId = {
   date: string;
   time: string;
   foodId: string;
};

export type ConsumptionPayload<T extends FoodPortionCreationDto = FoodPortionCreationDto> = {
   date: string;
   time: ConsumptionTime;
   creationDto: T;
};

export type AddConsumptionPayload = ConsumptionPayload & {
   append: boolean;
};

export const addConsumption = createAction<AddConsumptionPayload>('diary/add-consumption');
export const setConsumption = createAction<ConsumptionPayload>('diary/set-consumption');
export const removeConsumption = createAction<ConsumptionId>('diary/remove-consumption');

export type SetConsumptionDialogActionPayload = ConsumptionPayload<ProductFoodPortionCreationDto> & {
   amount: number;
   servingType: string;
};

export const setConsumptionDialogAction = createAction<SetConsumptionDialogActionPayload>(
   'diary/set-consumption-dialog-action',
);

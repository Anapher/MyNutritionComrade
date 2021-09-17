import { createAction } from '@reduxjs/toolkit';
import { ConsumptionTime, FoodPortion, FoodPortionCreationDto } from 'src/types';

export type AddProductPayload = {
   creationDto: FoodPortionCreationDto;
   foodPortion?: FoodPortion;
   date: string;
   time: ConsumptionTime;
};

export const addProduct = createAction<AddProductPayload>(`diary/add-product`);

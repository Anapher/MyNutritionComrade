import { ConsumedPortion, FoodPortion, FoodPortionCreationDto, ConsumptionTime } from 'src/types';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DiaryState = {
   selectedDate: string | null;
   consumedOnSelectedDay: ConsumedPortion[] | null;
   loadingSelectedDate: boolean;
};

const initialState: DiaryState = {
   selectedDate: null,
   consumedOnSelectedDay: null,
   loadingSelectedDate: false,
};

export const addProduct = createAction<AddProductPayload>(`diary/add-product`);

const diarySlice = createSlice({
   name: 'diary',
   initialState,
   reducers: {
      setSelectedDate(state, { payload }: PayloadAction<string>) {
         state.selectedDate = payload;
         state.consumedOnSelectedDay = null;
         state.loadingSelectedDate = true;
      },
      selectedDateLoaded(state, { payload }: PayloadAction<ConsumedPortion[]>) {
         state.loadingSelectedDate = false;
         state.consumedOnSelectedDay = payload;
      },
   },
   extraReducers: {
      [addProduct.type]: (state, { payload }: PayloadAction<AddProductPayload>) => {
         if (state.consumedOnSelectedDay) {
            state.consumedOnSelectedDay.push({
               date: payload.date,
               time: payload.time,
               foodPortion: payload.foodPortion!,
            });
         }
      },
   },
});

export const { setSelectedDate, selectedDateLoaded } = diarySlice.actions;

type AddProductPayload = {
   creationDto: FoodPortionCreationDto;
   foodPortion?: FoodPortion;
   date: string;
   time: ConsumptionTime;
};

export default diarySlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConsumedPortion } from 'src/types';

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
});

export const { setSelectedDate, selectedDateLoaded } = diarySlice.actions;

export default diarySlice.reducer;

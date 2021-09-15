import { RootState } from 'src/store';

export const getSelectedDate = (state: RootState) => state.diary.selectedDate;
export const selectConsumedPortions = (state: RootState) => state.diary.consumedOnSelectedDay;

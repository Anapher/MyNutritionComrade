import { createSlice } from '@reduxjs/toolkit';

export type SettingsState = {
   firstStart: boolean;
};

const initialState: SettingsState = {
   firstStart: true,
};

const settingsSlice = createSlice({
   name: 'settings',
   initialState,
   reducers: {
      firstStartCompleted(state) {
         state.firstStart = false;
      },
   },
});

export const { firstStartCompleted } = settingsSlice.actions;

export default settingsSlice.reducer;

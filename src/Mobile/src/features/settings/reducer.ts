import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPersonalInfo } from './types';

export type SettingsState = {
   firstStart: boolean;
   personalInfo: UserPersonalInfo;
};

const initialState: SettingsState = {
   firstStart: true,
   personalInfo: {},
};

const settingsSlice = createSlice({
   name: 'settings',
   initialState,
   reducers: {
      firstStartCompleted(state) {
         state.firstStart = false;
      },
      setPersonalInfo(state, { payload }: PayloadAction<UserPersonalInfo>) {
         state.personalInfo = payload;
      },
   },
});

export const { firstStartCompleted, setPersonalInfo } = settingsSlice.actions;

export default settingsSlice.reducer;

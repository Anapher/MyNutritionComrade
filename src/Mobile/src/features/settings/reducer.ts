import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserNutritionGoal, UserPersonalInfo, UserWeight } from './types';

export type SettingsState = {
   firstStart: boolean;
   auth?: {
      token: string;
      email: string;
   };
   personalInfo: UserPersonalInfo;
   weight: UserWeight;
   nutritionGoal: UserNutritionGoal;
};

const initialState: SettingsState = {
   firstStart: true,
   weight: {},
   personalInfo: {},
   nutritionGoal: {},
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
      setWeight(state, { payload }: PayloadAction<UserWeight>) {
         state.weight = payload;
      },
      setNutritionGoal(state, { payload }: PayloadAction<UserNutritionGoal>) {
         state.nutritionGoal = payload;
      },
   },
});

export const { firstStartCompleted, setPersonalInfo, setWeight, setNutritionGoal } = settingsSlice.actions;

export default settingsSlice.reducer;

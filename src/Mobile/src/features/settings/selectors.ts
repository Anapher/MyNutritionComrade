import { createSelector } from 'reselect';
import { RootState } from 'src/store';
import { calculateBmr } from 'src/utils/mifflin-st-jeor';
import { calculateAge } from './components/personal-info/utils';

export const selectIsFirstStart = (state: RootState) => state.settings.firstStart;

export const selectSettingsLoaded = (state: RootState) =>
   (state.settings as any)._persist.rehydrated as boolean | undefined;

export const selectPersonalInfo = (state: RootState) => state.settings.personalInfo;
export const selectWeightInfo = (state: RootState) => state.settings.weight;
export const selectNutritionGoal = (state: RootState) => state.settings.nutritionGoal;

export const selectNutritionGoalCalories = (state: RootState) => selectNutritionGoal(state).calories;
export const selectNutritionGoalProtein = (state: RootState) => selectNutritionGoal(state).protein;

export const selectUserCaloriesPerDay = createSelector(
   selectPersonalInfo,
   selectWeightInfo,
   selectNutritionGoalCalories,
   (personalInfo, weightInfo, calorieInfo) => {
      if (!calorieInfo) return undefined;
      if (calorieInfo.type === 'caloriesFixed') return calorieInfo.caloriesPerDay;

      if (calorieInfo.type === 'caloriesMifflinStJeor') {
         if (!personalInfo.gender || !personalInfo.birthday || !personalInfo.height || !weightInfo.currentWeight)
            return undefined;

         const bms = calculateBmr(
            personalInfo.gender,
            weightInfo.currentWeight,
            personalInfo.height * 100,
            calculateAge(personalInfo.birthday),
         );

         const result = bms * calorieInfo.palFactor + (calorieInfo.calorieBalance ?? 0);
         return result;
      }
   },
);

export const selectUserProteinPerDay = createSelector(
   selectWeightInfo,
   selectNutritionGoalProtein,
   (weightInfo, proteinInfo) => {
      if (!proteinInfo) return undefined;
      if (proteinInfo.type === 'proteinFixed') return proteinInfo.proteinPerDay;
      if (proteinInfo.type === 'proteinByBodyweight') {
         if (!weightInfo.currentWeight) return undefined;
         return proteinInfo.proteinPerKgBodyweight * weightInfo.currentWeight;
      }
   },
);

export const selectIsUserAuthenticated = (state: RootState) => Boolean(state.settings.auth);
export const selectAuthInfo = (state: RootState) => state.settings.auth;

export type UserPersonalInfo = {
   birthday?: string;
   gender?: 'male' | 'female';
   height?: number;
};

export type UserWeight = {
   currentWeight?: number;
};

export type ProteinByBodyweightNutritionGoal = {
   type: 'proteinByBodyweight';
   proteinPerKgBodyweight: number;
};

export type ProteinFixedNutritionGoal = {
   type: 'proteinFixed';
   proteinPerDay: number;
};

export type CaloriesFixedNutritionGoal = {
   type: 'caloriesFixed';
   caloriesPerDay: number;
};

export type CaloriesMifflinStJeorNutritionGoal = {
   type: 'caloriesMifflinStJeor';
   palFactor: number;
   calorieBalance: number;
   calorieOffset: number;
};

export type NutrientDistribution = {
   type: 'proportionalDistribution';
   carbohydrates: number;
   protein: number;
   fat: number;
};

export type UserNutritionGoal = {
   calories?: CaloriesFixedNutritionGoal | CaloriesMifflinStJeorNutritionGoal;
   protein?: ProteinFixedNutritionGoal | ProteinByBodyweightNutritionGoal;
   distribution?: NutrientDistribution;
};

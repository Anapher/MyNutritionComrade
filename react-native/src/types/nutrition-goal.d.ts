declare module 'Models' {
    export interface CaloriesFixedNutritionGoal {
        type: 'caloriesFixed';
        caloriesPerDay: number;
    }

    export interface CaloriesMifflinStJeorNutritionGoal {
        type: 'caloriesMifflinStJeor';
        palFactor: number;
        calorieBalance: number;
        calorieOffset: number;
    }

    export interface NutrientDistribution {
        type: 'proportionalDistribution';
        carbohydrates: number;
        protein: number;
        fat: number;
    }

    export interface ProteinByBodyweightNutritionGoal {
        type: 'proteinByBodyweight';
        proteinPerKgBodyweight: number;
    }

    export interface ProteinFixedNutritionGoal {
        type: 'proteinFixed';
        proteinPerDay: number;
    }

    export interface UserNutritionGoal {
        calories?: CaloriesFixedNutritionGoal | CaloriesMifflinStJeorNutritionGoal;
        protein?: ProteinFixedNutritionGoal | ProteinByBodyweightNutritionGoal;
        distribution?: NutrientDistribution;
    }

    export interface ComputedNutritionGoals {
        caloriesPerDay?: number;
        proteinPerDay?: number;
        distribution?: NutrientDistribution;
    }
}

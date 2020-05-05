declare module 'Models' {
    export interface UserPersonalInfo {
        birthday?: string;
        gender?: 'male' | 'female';
        height?: number;
    }

    export interface UserSettings {
        personalInfo?: UserPersonalInfo;
        nutritionGoal?: UserNutritionGoal;
    }
}

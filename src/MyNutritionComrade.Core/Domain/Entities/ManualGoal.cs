namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ManualGoal
    {
        public double? DailyCalories { get; set; }
        public double? DailyProtein { get; set; }

        public NutrientDistribution? Distribution { get; set; }
    }

    public class FitnessGoal : BodyweightGoal
    {
        public double ProteinPerKgBodyweight { get; set; }
    }

    public class BodyweightGoal
    {
        public double CalorieBalance { get; set; }
        public double CalorieOffset { get; set; }
    }

    public enum ActivityLevel
    {

    }

    public class NutrientDistribution
    {
        public double Carbohydrates { get; set; }
        public double Protein { get; set; }
        public double Fat { get; set; }
    }
}

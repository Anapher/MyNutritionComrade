namespace MyNutritionComrade.Core.Domain.Entities.Goal
{
    public class NutrientDistribution : NutritionGoalBase
    {
        public double Carbohydrates { get; set; }
        public double Protein { get; set; }
        public double Fat { get; set; }

        public override NutritionGoalType Type { get; } = NutritionGoalType.ProportionalDistribution;
    }
}
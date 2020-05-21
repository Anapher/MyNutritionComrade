namespace MyNutritionComrade.Core.Domain.Entities.Goal
{
    public class ProteinFixedNutritionGoal : NutritionGoalBase
    {
        public double ProteinPerDay { get; set; }

        public override NutritionGoalType Type { get; } = NutritionGoalType.Protein;
    }
}
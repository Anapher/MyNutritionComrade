namespace MyNutritionComrade.Core.Domain.Entities.Goal
{
    public class ProteinByBodyweightNutritionGoal : NutritionGoalBase
    {
        public double ProteinPerKgBodyweight { get; set; }
        public override NutritionGoalType Type { get; } = NutritionGoalType.Protein;
    }
}
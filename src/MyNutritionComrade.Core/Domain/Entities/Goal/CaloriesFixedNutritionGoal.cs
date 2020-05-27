namespace MyNutritionComrade.Core.Domain.Entities.Goal
{
    public class CaloriesFixedNutritionGoal : NutritionGoalBase
    {
        public double CaloriesPerDay { get; set; }
        public override NutritionGoalType Type { get; } = NutritionGoalType.CaloriesFixed;
    }
}

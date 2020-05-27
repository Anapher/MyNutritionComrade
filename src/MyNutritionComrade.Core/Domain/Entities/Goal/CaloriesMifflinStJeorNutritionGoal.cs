namespace MyNutritionComrade.Core.Domain.Entities.Goal
{
    public class CaloriesMifflinStJeorNutritionGoal : NutritionGoalBase
    {
        /// <summary>
        ///     Physical activity level factor
        /// </summary>
        public double PalFactor { get; set; }

        /// <summary>
        ///     Zero if the person wants to hold his weight, a negative number if he wants to loose, a positive if he wants to gain
        /// </summary>
        public double CalorieBalance { get; set; }

        /// <summary>
        ///     Has the same effect as <see cref="CalorieBalance" />, but is meant to fix errors in the calorie calculations
        /// </summary>
        public double CalorieOffset { get; set; }

        public override NutritionGoalType Type { get; } = NutritionGoalType.CaloriesMifflinStJeor;
    }
}
using FluentValidation;
using MyNutritionComrade.Core.Domain.Entities.Goal;

namespace MyNutritionComrade.Core.Domain.Validation.Goal
{
    public class CaloriesMifflinStJeorNutritionGoalValidator : AbstractValidator<CaloriesMifflinStJeorNutritionGoal>
    {
        public CaloriesMifflinStJeorNutritionGoalValidator()
        {
            RuleFor(x => x.PalFactor).GreaterThan(0);
        }
    }
}

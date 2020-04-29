using FluentValidation;
using MyNutritionComrade.Core.Domain.Entities.Goal;

namespace MyNutritionComrade.Core.Domain.Validation.Goal
{
    public class CaloriesFixedNutritionGoalValidator : AbstractValidator<CaloriesFixedNutritionGoal>
    {
        public CaloriesFixedNutritionGoalValidator()
        {
            RuleFor(x => x.CaloriesPerDay).GreaterThan(0);
        }
    }
}

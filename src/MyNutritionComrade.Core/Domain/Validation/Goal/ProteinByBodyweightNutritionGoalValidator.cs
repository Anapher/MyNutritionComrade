using FluentValidation;
using MyNutritionComrade.Core.Domain.Entities.Goal;

namespace MyNutritionComrade.Core.Domain.Validation.Goal
{
    public class ProteinByBodyweightNutritionGoalValidator : AbstractValidator<ProteinByBodyweightNutritionGoal>
    {
        public ProteinByBodyweightNutritionGoalValidator()
        {
            RuleFor(x => x.ProteinPerKgBodyweight).GreaterThan(0);
        }
    }
}

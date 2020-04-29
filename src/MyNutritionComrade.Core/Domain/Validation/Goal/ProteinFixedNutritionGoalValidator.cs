using FluentValidation;
using MyNutritionComrade.Core.Domain.Entities.Goal;

namespace MyNutritionComrade.Core.Domain.Validation.Goal
{
    public class ProteinFixedNutritionGoalValidator : AbstractValidator<ProteinFixedNutritionGoal>
    {
        public ProteinFixedNutritionGoalValidator()
        {
            RuleFor(x => x.ProteinPerDay).GreaterThan(0);
        }
    }
}

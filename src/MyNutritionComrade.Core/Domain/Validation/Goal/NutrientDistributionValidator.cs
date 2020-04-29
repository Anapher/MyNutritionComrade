using FluentValidation;
using MyNutritionComrade.Core.Domain.Entities.Goal;

namespace MyNutritionComrade.Core.Domain.Validation.Goal
{
    public class NutrientDistributionValidator : AbstractValidator<NutrientDistribution>
    {
        public NutrientDistributionValidator()
        {
            RuleFor(x => x).Must(x => x.Carbohydrates + x.Fat + x.Protein == 1).WithMessage("The macros must sum to a value of one (100%).");
        }
    }
}

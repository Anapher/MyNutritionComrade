using System.Collections.Generic;
using FluentValidation;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Domain.Entities.Goal;

namespace MyNutritionComrade.Core.Domain.Validation
{
    public class UserSettingsValidator : AbstractValidator<UserSettings>
    {
        public UserSettingsValidator()
        {
            RuleFor(x => x.NutritionGoal).NotNull();
            RuleFor(x => x.PersonalInfo).NotNull();
            RuleForEach(x => x.NutritionGoal).SetValidator(new NutritionGoalBaseValidator());
        }
    }

    public class NutritionGoalBaseValidator : AbstractValidator<KeyValuePair<NutritionGoalType, NutritionGoalBase>>
    {
        public NutritionGoalBaseValidator()
        {
            When(x => x.Value is CaloriesFixedNutritionGoal, () => RuleFor(x => ((CaloriesFixedNutritionGoal) x.Value).CaloriesPerDay).GreaterThan(0));
            When(x => x.Value is CaloriesMifflinStJeorNutritionGoal,
                () => RuleFor(x => ((CaloriesMifflinStJeorNutritionGoal) x.Value).PalFactor).GreaterThan(0));
            When(x => x.Value is NutrientDistribution,
                () => RuleFor(x => ((NutrientDistribution) x.Value)).Must(x => x.Carbohydrates + x.Fat + x.Protein == 1)
                    .WithMessage("The macros must sum to a value of one (100%)."));
            When(x => x.Value is ProteinByBodyweightNutritionGoal,
                () => RuleFor(x => ((ProteinByBodyweightNutritionGoal) x.Value).ProteinPerKgBodyweight).GreaterThan(0));
            When(x => x.Value is ProteinFixedNutritionGoal, () => RuleFor(x => ((ProteinFixedNutritionGoal) x.Value).ProteinPerDay).GreaterThan(0));
        }
    }
}

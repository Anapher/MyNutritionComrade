using FluentValidation;
using MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation;

namespace MyNutritionComrade.Core.Domain.Validation
{
    public class FoodPortionCreationDtoValidator : AbstractValidator<FoodPortionCreationDto>
    {
        public FoodPortionCreationDtoValidator()
        {
            When(x => x is CustomFoodPortionCreationDto,
                () => RuleFor(x => ((CustomFoodPortionCreationDto) x).NutritionalInfo).NotNull().SetValidator(new NutritionalInfoValidator()));

            When(x => x is ProductFoodPortionCreationDto, () =>
            {
                RuleFor(x => ((ProductFoodPortionCreationDto) x).ProductId).NotEmpty();
                RuleFor(x => ((ProductFoodPortionCreationDto) x).ServingType).NotEmpty();
                RuleFor(x => ((ProductFoodPortionCreationDto) x).Amount).GreaterThan(0);
            });

            When(x => x is MealFoodPortionCreationDto, () =>
            {
                RuleFor(x => ((MealFoodPortionCreationDto)x).MealId).NotEmpty();
                RuleForEach(x => ((MealFoodPortionCreationDto) x).OverwriteIngredients).ChildRules(rules =>
                {
                    rules.RuleFor(x => x).Must(x => x is ProductFoodPortionCreationDto || x is CustomFoodPortionCreationDto);
                    rules.RuleFor(x => x).SetValidator(this);
                });
                RuleFor(x => ((MealFoodPortionCreationDto)x).Portion).GreaterThan(0);
            });

            When(x => x is SuggestionFoodPortionCreationDto, () =>
            {
                RuleFor(x => ((SuggestionFoodPortionCreationDto)x).SuggestionId).NotEmpty();
                RuleFor(x => ((SuggestionFoodPortionCreationDto) x).Items).NotEmpty();
                RuleForEach(x => ((SuggestionFoodPortionCreationDto) x).Items)
                    .ChildRules(rules => rules.RuleFor(x => x).SetValidator(this));
            });
        }
    }
}

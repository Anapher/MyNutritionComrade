using FluentValidation;
using MyNutritionComrade.Core.Dto.UseCaseRequests;

namespace MyNutritionComrade.Core.Domain.Validation
{
    public class CreateMealDtoValidator : AbstractValidator<CreateMealDto>
    {
        public CreateMealDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleForEach(x => x.Items).SetValidator(new FoodPortionCreationDtoValidator());
        }
    }
}

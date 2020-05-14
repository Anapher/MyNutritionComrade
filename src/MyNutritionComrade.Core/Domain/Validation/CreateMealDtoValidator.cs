using FluentValidation;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Extensions;

namespace MyNutritionComrade.Core.Domain.Validation
{
    public class CreateMealDtoValidator : AbstractValidator<CreateMealDto>
    {
        public CreateMealDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleForEach(x => x.Products).ChildRules(rules =>
            {
                rules.RuleFor(x => x.Amount).GreaterThan(0);
                rules.RuleFor(x => x.ProductId).NotEmpty();
                rules.RuleFor(x => x.ServingType).NotNull();
            });
            RuleFor(x => x.Products).UniqueItems(CreateMealProductDto.ProductIdComparer);
        }
    }
}

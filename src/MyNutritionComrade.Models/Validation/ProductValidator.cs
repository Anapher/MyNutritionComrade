using FluentValidation;

namespace MyNutritionComrade.Models.Validation
{
    public class ProductValidator : AbstractValidator<Product>
    {
        public ProductValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x).SetValidator(new ProductPropertiesValidator());
        }
    }
}

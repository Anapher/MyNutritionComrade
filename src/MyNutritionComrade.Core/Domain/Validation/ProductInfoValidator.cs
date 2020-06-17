using FluentValidation;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Extensions;

namespace MyNutritionComrade.Core.Domain.Validation
{
    public class ProductInfoValidator : AbstractValidator<ProductInfo>
    {
        public ProductInfoValidator()
        {
            RuleFor(x => x.NutritionalInfo.Volume).Equal(100);
            RuleFor(x => x.NutritionalInfo).SetValidator(new NutritionalInfoValidator());

            RuleFor(x => x.Code).NotEqual("");
            RuleFor(x => x.Label).NotEmpty();
            RuleForEach(x => x.Label).NotNull().ChildRules(labels =>
            {
                labels.RuleFor(x => x.Value.Value).NotEmpty();
                labels.RuleFor(x => x.Value.Tags).UniqueItems();
                labels.RuleFor(x => x.Key).NotEmpty().IsCulture();
            });
            RuleForEach(x => x.Tags).OneOf(ProductInfo.AllowedTags);
            RuleFor(x => x.Tags).UniqueItems();
            RuleFor(x => x.Servings).NotEmpty();
            RuleForEach(x => x.Servings).ChildRules(serving =>
            {
                serving.RuleFor(x => x.Value).GreaterThan(0);
                serving.RuleFor(x => x.Key).NotNull().OneOf(ServingType.AvailableTypes);
            });
            RuleFor(x => x).Must(x =>
            {
                if (x.Tags.Contains(ProductInfo.TagLiquid))
                {
                    return x.Servings.TryGetValue(ServingType.Milliliter, out var baseValue) && baseValue == 1 && !x.Servings.ContainsKey(ServingType.Gram);
                }
                else
                {
                    return x.Servings.TryGetValue(ServingType.Gram, out var baseValue) && baseValue == 1 && !x.Servings.ContainsKey(ServingType.Milliliter);
                }
            }).WithMessage("If the product is in liquid form, it must have a serving 'ml' with a value of 1 and no 'g' serving");
            RuleFor(x => x.DefaultServing).NotEmpty();
            RuleFor(x => x).Must(x => x.Servings.ContainsKey(x.DefaultServing)).WithMessage("The default serving must be defined in servings");
        }
    }
}

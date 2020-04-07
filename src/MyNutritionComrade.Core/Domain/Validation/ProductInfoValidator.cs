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
            RuleFor(x => x.NutritionalInfo.Energy).GreaterThan(0);
            RuleFor(x => x.NutritionalInfo.Fat).GreaterThanOrEqualTo(0);
            RuleFor(x => x.NutritionalInfo.SaturatedFat).GreaterThanOrEqualTo(0);
            RuleFor(x => x.NutritionalInfo.Carbohydrates).GreaterThanOrEqualTo(0);
            RuleFor(x => x.NutritionalInfo.Sugars).GreaterThanOrEqualTo(0);
            RuleFor(x => x.NutritionalInfo.Protein).GreaterThanOrEqualTo(0);
            RuleFor(x => x.NutritionalInfo.DietaryFiber).GreaterThanOrEqualTo(0);
            RuleFor(x => x.NutritionalInfo.Sodium).GreaterThanOrEqualTo(0);
            RuleFor(x => x.NutritionalInfo).Must(x => x.Carbohydrates >= x.Sugars + x.DietaryFiber)
                .WithMessage("The carbohydrates must not exceed the sum of sugars and dietary fiber");
            RuleFor(x => x.NutritionalInfo).Must(x => x.Fat >= x.SaturatedFat).WithMessage("The fat must not exceed the saturated fat");
            RuleFor(x => x.NutritionalInfo).Must(x => x.Carbohydrates + x.Fat + x.Protein + x.Sodium <= 100)
                .WithMessage("The nutritions must not exceed 100g.");

            RuleFor(x => x.Code).NotEqual("");
            RuleFor(x => x.Label).NotEmpty().UniqueItems();
            RuleForEach(x => x.Label).NotNull().ChildRules(labels =>
            {
                labels.RuleFor(x => x.Value).NotEmpty();
                labels.RuleFor(x => x.LanguageCode).NotEmpty().IsCulture();
            });
            RuleForEach(x => x.Tags).OneOf(ProductInfo.AllowedTags);
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

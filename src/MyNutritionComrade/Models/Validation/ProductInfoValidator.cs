using System.Collections.Generic;
using FluentValidation;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Extensions;

namespace MyNutritionComrade.Models.Validation
{
    public class ProductInfoValidator : AbstractValidator<ProductInfo>
    {
        private const string TagLiquid = "liquid";
        private static readonly ISet<string> Tags = new HashSet<string>(new List<string> {TagLiquid});

        public ProductInfoValidator()
        {
            RuleFor(x => x.NutritionInformation.Mass).Equal(100);
            RuleFor(x => x.NutritionInformation.Energy).GreaterThan(0);
            RuleFor(x => x.NutritionInformation.Fat).GreaterThanOrEqualTo(0);
            RuleFor(x => x.NutritionInformation.SaturatedFat).GreaterThanOrEqualTo(0);
            RuleFor(x => x.NutritionInformation.Carbohydrates).GreaterThanOrEqualTo(0);
            RuleFor(x => x.NutritionInformation.Sugars).GreaterThanOrEqualTo(0);
            RuleFor(x => x.NutritionInformation.Protein).GreaterThanOrEqualTo(0);
            RuleFor(x => x.NutritionInformation.DietaryFiber).GreaterThanOrEqualTo(0);
            RuleFor(x => x.NutritionInformation.Sodium).GreaterThanOrEqualTo(0);
            RuleFor(x => x.NutritionInformation).Must(x => x.Carbohydrates >= x.Sugars + x.DietaryFiber)
                .WithMessage("The carbohydrates must not exceed the sum of sugars and dietary fiber");
            RuleFor(x => x.NutritionInformation).Must(x => x.Fat >= x.SaturatedFat).WithMessage("The fat must not exceed the saturated fat");
            RuleFor(x => x.NutritionInformation).Must(x => x.Carbohydrates + x.Fat + x.Protein + x.Sodium <= 100)
                .WithMessage("The nutritions must not exceed 100g.");

            RuleFor(x => x.Label).NotEmpty().UniqueItems();
            RuleForEach(x => x.Label).NotNull().ChildRules(labels =>
            {
                labels.RuleFor(x => x.Value).NotEmpty();
                labels.RuleFor(x => x.LanguageCode).NotEmpty().IsCulture();
            });
            RuleForEach(x => x.Tags).OneOf(Tags);
            RuleFor(x => x.Servings).NotEmpty();
            RuleForEach(x => x.Servings).ChildRules(serving =>
            {
                serving.RuleFor(x => x.Value).GreaterThan(0);
                serving.RuleFor(x => x.Key).NotNull().OneOf(ServingType.AvailableTypes);
            });
            RuleFor(x => x).Must(x =>
            {
                if (x.Tags.Contains(TagLiquid))
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

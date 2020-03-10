using System.Collections.Generic;
using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Domain
{
    public class ProductDto
    {
        public ProductDto(NutritionInformation nutritionInformation, string? code, IList<LocalizedLabel> label, IList<ProductServingDto> servingTypes, string defaultServingType)
        {
            NutritionInformation = nutritionInformation;
            Code = code;
            Label = label;
            ServingTypes = servingTypes;
            DefaultServingType = defaultServingType;
        }

        public ProductDto(Product product)
        {
            NutritionInformation = product.NutritionInformation;
            Code = product.Code;
            Label = product.ProductLabel.Select(x => new LocalizedLabel(x.Name, x.LanguageCode)).ToList();
            ServingTypes = product.ProductServings.Select(x => new ProductServingDto(x.Weight, x.ServingType.Name,
                x.ProductServingLabels.Select(y => new ItemLocalizedLabel(y.Name, y.LanguageCode, y.PluralLabel)).ToList())).ToList();
            DefaultServingType = product.DefaultServing.Name;
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private ProductDto()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        public NutritionInformation NutritionInformation { get; private set; }
        public string? Code { get; private set; }
        public IList<LocalizedLabel> Label { get; private set; }
        public IList<ProductServingDto> ServingTypes { get; private set; }
        public string DefaultServingType { get; private set; }
    }
}
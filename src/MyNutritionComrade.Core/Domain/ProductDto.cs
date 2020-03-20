using System.Collections.Generic;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Domain
{
    public class ProductDto
    {
        public ProductDto(string id, string? code, NutritionInformation nutritionInformation, IList<ProductLabel> label, IDictionary<ServingType, double> servings, ServingType defaultServingType, ISet<string> tags)
        {
            Id = id;
            Code = code;
            NutritionInformation = nutritionInformation;
            Label = label;
            Servings = servings;
            DefaultServing = defaultServingType;
            Tags = tags;
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private ProductDto()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        public string Id { get; private set; }
        public string? Code { get; private set; }
        public NutritionInformation NutritionInformation { get; private set; }
        public IList<ProductLabel> Label { get; private set; }
        public IDictionary<ServingType, double> Servings { get; private set; }
        public ServingType DefaultServing { get; private set; }
        public ISet<string> Tags { get; private set; }
    }
}
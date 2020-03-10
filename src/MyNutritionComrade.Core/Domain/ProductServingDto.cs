using System.Collections.Generic;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Domain
{
    public class ProductServingDto
    {
        public ProductServingDto(double weight, string servingType, IReadOnlyList<ItemLocalizedLabel> label)
        {
            Weight = weight;
            ServingType = servingType;
            Label = label;
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private ProductServingDto(string servingType)
        {
            ServingType = servingType;
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        public double Weight { get; private set; }
        public string ServingType { get; private set; }
        public IReadOnlyList<ItemLocalizedLabel> Label { get; private set; }

        public string Key => $"{Weight}/{ServingType}";
    }
}
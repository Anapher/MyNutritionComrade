using System.Collections.Generic;
using MyNutritionComrade.Core.Shared;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public class Product : BaseEntity
    {
        public Product(NutritionInformation nutritionInformation, string? code = null)
        {
            NutritionInformation = nutritionInformation;
            Code = code;
        }

#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.
        private Product()
        {
        }
#pragma warning restore CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

        public string? Code { get; set; }
        public NutritionInformation NutritionInformation { get; private set; }

        public IEnumerable<ProductLabel>? ProductLabels { get; private set; }
        public IEnumerable<ProductServing>? ProductServings { get; private set; }
    }
}

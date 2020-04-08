#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

using System.Collections.Generic;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Models.Response
{
    public class ProductSearchDto
    {
        public string Id { get; set; }
        public string? Code { get; set; }
        public string[] Tags { get; set; }
        public NutritionalInfo NutritionalInfo { get; set; }
        public Dictionary<string, double> Servings { get; set; }
        public List<ProductLabel> Label { get; set; }
        public string DefaultServing { get; set; }
    }
}

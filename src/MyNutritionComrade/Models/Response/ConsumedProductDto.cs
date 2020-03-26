#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

using System;
using System.Collections.Generic;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Models.Response
{
    public class ConsumedProductDto
    {
        public DateTime Day { get; set; }
        public ConsumptionTime Time { get; set; }

        public string ProductId { get; set; }

        public NutritionInformation NutritionInformation { get; set; }
        public ISet<string> Tags { get; set; }

        public IEnumerable<ProductLabel> Label { get; set; }
    }
}
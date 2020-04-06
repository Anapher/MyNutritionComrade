#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

using System;
using System.Collections.Generic;
using MyNutritionComrade.Config.Converter;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using Newtonsoft.Json;

namespace MyNutritionComrade.Models.Response
{
    public class ConsumedProductDto
    {
        [JsonConverter(typeof(DateTimeDayOnlyJsonConverter))]
        public DateTime Date { get; set; }

        public ConsumptionTime Time { get; set; }

        public string ProductId { get; set; }

        public NutritionalInfo NutritionalInfo { get; set; }
        public ISet<string> Tags { get; set; }

        public IEnumerable<ProductLabel> Label { get; set; }
    }
}

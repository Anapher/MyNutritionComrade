#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

using System;
using MyNutritionComrade.Config.Converter;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using Newtonsoft.Json;

namespace MyNutritionComrade.Models.Response
{
    public class ConsumedDto
    {
        [JsonConverter(typeof(DateTimeDayOnlyJsonConverter))]
        public DateTime Date { get; set; }

        public ConsumptionTime Time { get; set; }

        public FoodPortionDto FoodPortion { get; set; }
    }
}

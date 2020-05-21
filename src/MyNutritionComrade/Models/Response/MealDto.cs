#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

using System;
using System.Collections.Generic;
using MyNutritionComrade.Core.Domain;

namespace MyNutritionComrade.Models.Response
{
    public class MealDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public NutritionalInfo NutritionalInfo { get; set; }

        public IEnumerable<FoodPortionDto> Items { get; set; }
    }
}

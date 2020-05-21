#pragma warning disable 8618

using System.Collections.Generic;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Domain.Entities.Consumption;

namespace MyNutritionComrade.Models.Response
{
    public abstract class FoodPortionDto
    {
        public abstract FoodPortionType Type { get; }
        public NutritionalInfo NutritionalInfo { get; set; }
    }

    public abstract class FoodPortionItemDto : FoodPortionDto
    {
    }

    public class FoodPortionMealDto : FoodPortionDto
    {
        public string MealId { get; set; }
        public string MealName { get; set; }
        public double Portion { get; set; }

        public List<FoodPortionItemDto> Items { get; set; }
        public override FoodPortionType Type { get; } = FoodPortionType.Meal;
    }

    public class FoodPortionSuggestedDto : FoodPortionDto
    {
        public string SuggestionId { get; set; }
        public List<FoodPortionDto> Items { get; set; }
        public override FoodPortionType Type { get; } = FoodPortionType.Suggestion;
    }

    public class FoodPortionProductDto : FoodPortionItemDto
    {
        public ProductDto Product { get; set; }

        public ServingType ServingType { get; set; }
        public double Amount { get; set; }
        public override FoodPortionType Type { get; } = FoodPortionType.Product;
    }

    public class FoodPortionCustomDto : FoodPortionItemDto
    {
        public string? Label { get; set; }
        public override FoodPortionType Type { get; } = FoodPortionType.Custom;
    }
}

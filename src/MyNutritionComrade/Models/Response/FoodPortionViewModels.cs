#pragma warning disable 8618

using System.Collections.Generic;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Models.Response
{
    public abstract class FoodPortionDto
    {
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
    }

    public class FoodPortionSuggestedDto : FoodPortionDto
    {
        public string SuggestionId { get; set; }
        public List<FoodPortionDto> Items { get; set; }
    }

    public class FoodPortionProductDto : FoodPortionItemDto
    {
        public ProductDto Product { get; set; }

        public ServingType ServingType { get; set; }
        public double Amount { get; set; }
    }

    public class FoodPortionCustomDto : FoodPortionItemDto
    {
        public string? Label { get; set; }
    }
}

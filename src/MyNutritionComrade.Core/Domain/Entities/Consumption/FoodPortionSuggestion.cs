using System.Collections.Generic;

namespace MyNutritionComrade.Core.Domain.Entities.Consumption
{
    public class FoodPortionSuggestion : FoodPortion
    {
        public FoodPortionSuggestion(NutritionalInfo nutritionalInfo, string suggestionId, List<FoodPortion> items) : base(nutritionalInfo)
        {
            SuggestionId = suggestionId;
            Items = items;
        }

        public string SuggestionId { get; set; }
        public List<FoodPortion> Items { get; set; }

        public override string GetId() => SuggestionId;
    }
}
using System.Collections.Generic;
using MyNutritionComrade.Core.Domain.Entities.Consumption;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation
{
    public class SuggestionFoodPortionCreationDto : FoodPortionCreationDto
    {
        public SuggestionFoodPortionCreationDto(string suggestionId, List<FoodPortionCreationDto> items)
        {
            SuggestionId = suggestionId;
            Items = items;
        }

        public string SuggestionId { get; set; }
        public List<FoodPortionCreationDto> Items { get; set; }
        public override FoodPortionType Type { get; } = FoodPortionType.Suggestion;
    }
}

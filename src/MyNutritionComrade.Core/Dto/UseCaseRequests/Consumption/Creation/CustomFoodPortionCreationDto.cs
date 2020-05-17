using MyNutritionComrade.Core.Domain;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation
{
    public class CustomFoodPortionCreationDto : FoodPortionCreationDto
    {
        public CustomFoodPortionCreationDto(NutritionalInfo nutritionalInfo, string? label)
        {
            NutritionalInfo = nutritionalInfo;
            Label = label;
        }

        public string? Label { get; private set; }
        public NutritionalInfo NutritionalInfo { get; private set; }
    }
}

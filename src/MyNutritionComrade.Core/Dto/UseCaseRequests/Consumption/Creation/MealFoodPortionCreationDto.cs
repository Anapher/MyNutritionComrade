using System.Collections.Generic;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation
{
    public class MealFoodPortionCreationDto : FoodPortionCreationDto
    {
        public MealFoodPortionCreationDto(string mealId, double portion)
        {
            MealId = mealId;
            Portion = portion;
        }

        public string MealId { get; private set; }
        public double Portion { get; private set; }

        public List<FoodPortionCreationDto>? OverwriteIngredients { get; set; }
    }
}

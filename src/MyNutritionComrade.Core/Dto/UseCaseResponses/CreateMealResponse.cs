using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Dto.UseCaseResponses
{
    public class CreateMealResponse
    {
        public CreateMealResponse(Meal meal)
        {
            Meal = meal;
        }

        public Meal Meal { get; }
    }
}

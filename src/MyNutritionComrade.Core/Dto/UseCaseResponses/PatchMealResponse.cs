using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Dto.UseCaseResponses
{
    public class PatchMealResponse
    {
        public PatchMealResponse(Meal meal)
        {
            Meal = meal;
        }

        public Meal Meal { get; }
    }
}

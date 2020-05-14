using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class DeleteMealRequest : IUseCaseRequest<DeleteMealResponse>
    {
        public DeleteMealRequest(string mealId, string userId)
        {
            MealId = mealId;
            UserId = userId;
        }

        public string MealId { get; }
        public string UserId { get; }
    }
}

using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class CalculateCurrentNutritionGoalRequest : IUseCaseRequest<CalculateCurrentNutritionGoalResponse>
    {
        public CalculateCurrentNutritionGoalRequest(string userId)
        {
            UserId = userId;
        }

        public string UserId { get; }
    }
}

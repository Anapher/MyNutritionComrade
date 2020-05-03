using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class PatchNutritionGoalsRequest : IUseCaseRequest<PatchNutritionGoalsResponse>
    {
        public PatchNutritionGoalsRequest(UserNutritionGoal newValue, string userId)
        {
            NewValue = newValue;
            UserId = userId;
        }

        public UserNutritionGoal NewValue { get; }
        public string UserId { get; }
    }
}

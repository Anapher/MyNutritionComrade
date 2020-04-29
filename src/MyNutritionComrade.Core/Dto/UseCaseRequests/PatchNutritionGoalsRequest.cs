using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class PatchNutritionGoalsRequest : IUseCaseRequest<PatchNutritionGoalsResponse>
    {
        public PatchNutritionGoalsRequest(UserNutritionGoal partialUserNutritionGoal, string userId)
        {
            PartialUserNutritionGoal = partialUserNutritionGoal;
            UserId = userId;
        }

        public UserNutritionGoal PartialUserNutritionGoal { get; }
        public string UserId { get; }
    }
}

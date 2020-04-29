using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Dto.UseCaseResponses
{
    public class PatchNutritionGoalsResponse
    {
        public PatchNutritionGoalsResponse(UserNutritionGoal result)
        {
            Result = result;
        }

        public UserNutritionGoal Result { get; }
    }
}

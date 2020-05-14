using Microsoft.AspNetCore.JsonPatch;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class PatchMealRequest : IUseCaseRequest<PatchMealResponse>
    {
        public PatchMealRequest(string userId, string mealId, JsonPatchDocument<CreateMealDto> patchDocument)
        {
            UserId = userId;
            PatchDocument = patchDocument;
            MealId = mealId;
        }

        public string UserId { get; }
        public string MealId { get; }
        public JsonPatchDocument<CreateMealDto> PatchDocument { get; }
    }
}

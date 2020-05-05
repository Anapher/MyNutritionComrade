using Microsoft.AspNetCore.JsonPatch;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class PatchUserSettingsRequest : IUseCaseRequest<PatchUserSettingsResponse>
    {
        public PatchUserSettingsRequest(JsonPatchDocument<UserSettings> patchDocument, string userId)
        {
            PatchDocument = patchDocument;
            UserId = userId;
        }

        public JsonPatchDocument<UserSettings> PatchDocument { get; set; }
        public string UserId { get; }
    }
}

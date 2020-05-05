using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Dto.UseCaseResponses
{
    public class PatchUserSettingsResponse
    {
        public PatchUserSettingsResponse(UserSettings result)
        {
            Result = result;
        }

        public UserSettings Result { get; }
    }
}

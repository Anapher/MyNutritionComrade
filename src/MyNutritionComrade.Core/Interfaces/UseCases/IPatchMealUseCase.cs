using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;

namespace MyNutritionComrade.Core.Interfaces.UseCases
{
    public interface IPatchMealUseCase : IUseCaseRequestHandler<PatchMealRequest, PatchMealResponse>
    {
    }
}

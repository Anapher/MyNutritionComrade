using System.Threading.Tasks;
using MyNutritionComrade.Core.Dto.UseCaseResponses;

namespace MyNutritionComrade.Core.Services.NutritionHandler
{
    public interface INutritionGoalHandler<in TGoal>
    {
        ValueTask SetGoal(string userId, CalculateCurrentNutritionGoalResponse response, TGoal goal);
    }
}

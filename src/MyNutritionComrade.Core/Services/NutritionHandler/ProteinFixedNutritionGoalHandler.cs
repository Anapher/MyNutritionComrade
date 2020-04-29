using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Goal;
using MyNutritionComrade.Core.Dto.UseCaseResponses;

namespace MyNutritionComrade.Core.Services.NutritionHandler
{
    public class ProteinFixedNutritionGoalHandler : INutritionGoalHandler<ProteinFixedNutritionGoal>
    {
        public ValueTask SetGoal(string userId, CalculateCurrentNutritionGoalResponse response, ProteinFixedNutritionGoal goal)
        {
            response.ProteinPerDay = goal.ProteinPerDay;
            return new ValueTask();
        }
    }
}

using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Goal;
using MyNutritionComrade.Core.Dto.UseCaseResponses;

namespace MyNutritionComrade.Core.Services.NutritionHandler
{
    public class NutrientDistributionHandler : INutritionGoalHandler<NutrientDistribution>
    {
        public ValueTask SetGoal(string userId, CalculateCurrentNutritionGoalResponse response, NutrientDistribution goal)
        {
            response.Distribution = goal;
            return new ValueTask();
        }
    }
}

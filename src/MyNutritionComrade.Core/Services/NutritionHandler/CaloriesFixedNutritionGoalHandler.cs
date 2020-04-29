using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Goal;
using MyNutritionComrade.Core.Dto.UseCaseResponses;

namespace MyNutritionComrade.Core.Services.NutritionHandler
{
    public class CaloriesFixedNutritionGoalHandler : INutritionGoalHandler<CaloriesFixedNutritionGoal>
    {
        public ValueTask SetGoal(string userId, CalculateCurrentNutritionGoalResponse response, CaloriesFixedNutritionGoal goal)
        {
            response.CaloriesPerDay = goal.CaloriesPerDay;

            return new ValueTask();
        }
    }
}

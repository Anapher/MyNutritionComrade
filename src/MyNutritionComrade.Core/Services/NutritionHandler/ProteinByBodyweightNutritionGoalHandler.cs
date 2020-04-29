using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Goal;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;

namespace MyNutritionComrade.Core.Services.NutritionHandler
{
    public class ProteinByBodyweightNutritionGoalHandler : INutritionGoalHandler<ProteinByBodyweightNutritionGoal>
    {
        private readonly ILoggedWeightRepository _weightRepository;

        public ProteinByBodyweightNutritionGoalHandler(ILoggedWeightRepository weightRepository)
        {
            _weightRepository = weightRepository;
        }

        public async ValueTask SetGoal(string userId, CalculateCurrentNutritionGoalResponse response, ProteinByBodyweightNutritionGoal goal)
        {
            var bodyweight = await _weightRepository.GetRecentAveragedWeight(userId);
            if (bodyweight == null)
                return;

            response.ProteinPerDay = goal.ProteinPerKgBodyweight * bodyweight;
        }
    }
}

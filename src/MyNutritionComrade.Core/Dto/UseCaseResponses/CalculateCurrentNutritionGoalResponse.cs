using MyNutritionComrade.Core.Domain.Entities.Goal;

namespace MyNutritionComrade.Core.Dto.UseCaseResponses
{
    public class CalculateCurrentNutritionGoalResponse
    {
        public double? CaloriesPerDay { get; set; }
        public double? ProteinPerDay { get; set; }
        public NutrientDistribution? Distribution { get; set; }
    }
}

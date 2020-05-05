using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Dto.UseCaseResponses
{
    public class LogWeightResponse
    {
        public LogWeightResponse(LoggedWeight entity)
        {
            Entity = entity;
        }

        public LoggedWeight Entity { get; }
    }
}

using MyNutritionComrade.Core.Domain.Entities.Consumption;

namespace MyNutritionComrade.Core.Dto.UseCaseResponses
{
    public class CreateConsumptionResponse
    {
        public CreateConsumptionResponse(Consumed consumed)
        {
            Consumed = consumed;
        }

        public Consumed Consumed { get; }
    }
}

using System;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Dto.UseCaseRequests.Consumption.Creation;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class CreateConsumptionRequest : IUseCaseRequest<CreateConsumptionResponse>
    {
        public CreateConsumptionRequest(string userId, DateTime date, ConsumptionTime consumptionTime, FoodPortionCreationDto dto)
        {
            UserId = userId;
            Date = date;
            ConsumptionTime = consumptionTime;
            Dto = dto;
        }

        public string UserId { get; }
        public DateTime Date { get; }
        public ConsumptionTime ConsumptionTime { get; }

        public FoodPortionCreationDto Dto { get; set; }
    }
}

using System;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class DeleteConsumptionRequest : IUseCaseRequest<DeleteConsumptionResponse>
    {
        public DeleteConsumptionRequest(string userId, DateTime date, ConsumptionTime time, string foodPortionId, FoodPortionType foodPortionType)
        {
            UserId = userId;
            Date = date;
            Time = time;
            FoodPortionId = foodPortionId;
            FoodPortionType = foodPortionType;
        }

        public string UserId { get; }
        public DateTime Date { get; }
        public ConsumptionTime Time { get; }
        public string FoodPortionId { get; }
        public FoodPortionType FoodPortionType { get; }
    }
}

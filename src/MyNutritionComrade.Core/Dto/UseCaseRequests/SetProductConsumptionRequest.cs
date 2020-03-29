using System;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class SetProductConsumptionRequest : IUseCaseRequest<SetProductConsumptionResponse>
    {
        public SetProductConsumptionRequest(string userId, DateTime date, ConsumptionTime consumptionTime, string productId, int value)
        {
            UserId = userId;
            Date = date;
            ConsumptionTime = consumptionTime;
            ProductId = productId;
            Value = value;
        }

        public string UserId { get; }
        public DateTime Date { get; }
        public ConsumptionTime ConsumptionTime { get; }

        public string ProductId { get; }

        /// <summary>
        ///     The new value of the product (usually the volume). If 0, the consumed product will be removed.
        /// </summary>
        public int Value { get; }
    }
}

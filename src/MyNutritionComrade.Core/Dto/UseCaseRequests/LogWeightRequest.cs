using System;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class LogWeightRequest : IUseCaseRequest<LogWeightResponse>
    {
        public LogWeightRequest(string userId, DateTimeOffset timestamp, double weight)
        {
            UserId = userId;
            Timestamp = timestamp;
            Weight = weight;
        }

        public string UserId { get; }
        public DateTimeOffset Timestamp { get; }
        public double Weight { get; }
    }
}

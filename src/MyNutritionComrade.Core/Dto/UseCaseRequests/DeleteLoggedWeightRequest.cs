using System;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class DeleteLoggedWeightRequest : IUseCaseRequest<DeleteLoggedWeightResponse>
    {
        public DeleteLoggedWeightRequest(string userId, DateTimeOffset timestamp)
        {
            UserId = userId;
            Timestamp = timestamp;
        }

        public string UserId { get; }
        public DateTimeOffset Timestamp { get; }
    }
}

using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;

namespace MyNutritionComrade.Core.Dto.UseCaseRequests
{
    public class VoteProductContributionRequest : IUseCaseRequest<VoteProductContributionResponse>
    {
        public VoteProductContributionRequest(string userId, string productContributionId, bool approve)
        {
            UserId = userId;
            ProductContributionId = productContributionId;
            Approve = approve;
        }

        public string UserId { get; }
        public string ProductContributionId { get; }
        public bool Approve { get; }
    }
}

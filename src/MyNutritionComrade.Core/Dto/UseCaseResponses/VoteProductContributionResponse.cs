using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.GatewayResponses.Repositories;

namespace MyNutritionComrade.Core.Dto.UseCaseResponses
{
    public class VoteProductContributionResponse
    {
        public VoteProductContributionResponse(ProductContribution productContribution, ProductContributionVote vote, ProductContributionVoting voting)
        {
            ProductContribution = productContribution;
            Vote = vote;
            Voting = voting;
        }

        public ProductContribution ProductContribution { get; }
        public ProductContributionVote Vote { get; }
        public ProductContributionVoting Voting { get; }
    }
}

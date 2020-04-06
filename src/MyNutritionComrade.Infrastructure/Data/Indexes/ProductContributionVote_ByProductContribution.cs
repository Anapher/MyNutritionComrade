#pragma warning disable CS8618 // Non-nullable field is uninitialized. Consider declaring as nullable.

using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.GatewayResponses.Repositories;
using Raven.Client.Documents.Indexes;

namespace MyNutritionComrade.Infrastructure.Data.Indexes
{
    public class ProductContributionVote_ByProductContribution : AbstractIndexCreationTask<ProductContributionVote, ProductContributionVoting>
    {
        public ProductContributionVote_ByProductContribution()
        {
            Map = votes => from vote in votes
                select new {vote.ProductContributionId, ApproveVotes = vote.Approve ? 1 : 0, DisapproveVotes = vote.Approve ? 0 : 1};

            Reduce = results =>
                from result in results
                group result by result.ProductContributionId
                into g
                select new
                {
                    ProductContributionId = g.Key,
                    ApproveVotes = g.Sum(x => x.ApproveVotes),
                    DisapproveVotes = g.Sum(x => x.DisapproveVotes)
                };
        }
    }
}

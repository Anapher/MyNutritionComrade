using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;
using Raven.Client.Documents.Indexes;

namespace MyNutritionComrade.Infrastructure.Data.Indexes
{
    public class ProductContributionVote_ByUserAndContribution : AbstractIndexCreationTask<ProductContributionVote>
    {
        public ProductContributionVote_ByUserAndContribution()
        {
            Map = votes => votes.Select(x => new {x.UserId, x.ProductContributionId});
        }
    }
}

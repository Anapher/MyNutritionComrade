using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade.Infrastructure.Data.CompareExchange
{
    public static class ProductContributionVoteCompareExchange
    {
        private const string ProductContributionVoteCompareExchangeName = "productContribution/vote";

        private static string GetProductContributionVoteKey(string contributionId, string userId) => $"{ProductContributionVoteCompareExchangeName}/{contributionId}/{userId}";

        public static void CreateProductContributionVote(IAsyncDocumentSession session, ProductContributionVote vote)
        {
            var key = GetProductContributionVoteKey(vote.ProductContributionId, vote.UserId);
            session.Advanced.ClusterTransaction.CreateCompareExchangeValue(key, vote.Approve);
        }

        public static async Task DeleteProductContributionVote(IAsyncDocumentSession session, ProductContributionVote vote)
        {
            var key = GetProductContributionVoteKey(vote.ProductContributionId, vote.UserId);
            var value = await session.Advanced.ClusterTransaction.GetCompareExchangeValueAsync<bool>(key);

            session.Advanced.ClusterTransaction.DeleteCompareExchangeValue(value);
        }
    }
}

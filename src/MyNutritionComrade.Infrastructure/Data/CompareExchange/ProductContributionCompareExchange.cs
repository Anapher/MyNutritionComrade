using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using Raven.Client.Documents.Operations.CompareExchange;
using Raven.Client.Documents.Session;

namespace MyNutritionComrade.Infrastructure.Data.CompareExchange
{
    public static class ProductContributionCompareExchange
    {
        private const string ProductContributionHash = "productContribution/patchHash";

        private static string GetProductContributionPatchHashKey(string productId, string patchHash) =>
            $"{ProductContributionHash}/{productId}/{patchHash}";

        public static void CreatePatchHash(IAsyncDocumentSession session, ProductContribution contribution)
        {
            var id = session.Advanced.GetDocumentId(contribution);

            var key = GetProductContributionPatchHashKey(contribution.ProductId, contribution.PatchHash);
            session.Advanced.ClusterTransaction.CreateCompareExchangeValue(key, id);
        }

        public static Task<CompareExchangeValue<string>> GetPatchHash(IAsyncDocumentSession session, string productId, string patchHash)
        {
            var key = GetProductContributionPatchHashKey(productId, patchHash);
            return session.Advanced.ClusterTransaction.GetCompareExchangeValueAsync<string>(key);
        }
    }
}

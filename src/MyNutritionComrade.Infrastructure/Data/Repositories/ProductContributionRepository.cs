using System.Collections.Generic;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Data.CompareExchange;
using MyNutritionComrade.Infrastructure.Shared;
using Raven.Client.Documents;
using Raven.Client.Exceptions;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class ProductContributionRepository : RavenRepo, IProductContributionRepository
    {
        private const string CollectionName = "productContribution";

        public ProductContributionRepository(IDocumentStore store): base(store)
        {
        }

        public Task<ProductContribution?> FindById(string productContributionId)
        {
            using var session = OpenReadOnlySession();
            return session.LoadAsync<ProductContribution?>(productContributionId);
        }

        public async Task<bool> Add(ProductContribution productContribution)
        {
            using var session = OpenWriteClusterSession();

            await session.StoreAsync(productContribution);

            if (productContribution.Status == ProductContributionStatus.Pending)
                ProductContributionCompareExchange.CreatePatchHash(session, productContribution);

            try
            {
                await session.SaveChangesAsync();
                return true;
            }
            catch (ConcurrencyException)
            {
                return false;
            }
        }

        public async Task<ProductContribution?> FindByPatchHash(string productId, string patchHash)
        {
            using var session = OpenReadOnlySession();

            var exchangeValue = await ProductContributionCompareExchange.GetPatchHash(session, productId, patchHash);
            if (exchangeValue == null) return null;

            return await session.LoadAsync<ProductContribution>(exchangeValue.Value);
        }

        public Task<List<ProductContribution>> GetActiveProductContributions(string productId)
        {
            using var session = OpenReadOnlySession();

            return session.Query<ProductContribution>().Where(x => x.Id == productId && x.Status == ProductContributionStatus.Pending, true).ToListAsync();
        }

        public async Task<bool> UpdateProductContribution(ProductContribution contribution)
        {
            using var session = OpenWriteClusterSession();

            await session.StoreAsync(contribution);

            var patchHash = await ProductContributionCompareExchange.GetPatchHash(session, contribution.ProductId, contribution.PatchHash);
            if (contribution.Status == ProductContributionStatus.Pending)
            {
                if (patchHash == null)
                    ProductContributionCompareExchange.CreatePatchHash(session, contribution);
                else
                {
                    if (patchHash.Value != contribution.Id)
                        return false; // attempting to make product contribution pending, but a product contribution with an equal patch hash already exists.
                }
            }
            else
            {
                if (patchHash?.Value == contribution.Id)
                {
                    session.Advanced.ClusterTransaction.DeleteCompareExchangeValue(patchHash.Key, patchHash.Index);
                }
            }

            try
            {
                await session.SaveChangesAsync();
                return true;
            }
            catch (ConcurrencyException)
            {
                return false;
            }
        }
    }
}

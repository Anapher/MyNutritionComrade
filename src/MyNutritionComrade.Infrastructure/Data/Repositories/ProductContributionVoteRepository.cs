﻿using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Dto.GatewayResponses.Repositories;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Data.CompareExchange;
using MyNutritionComrade.Infrastructure.Data.Indexes;
using MyNutritionComrade.Infrastructure.Shared;
using Raven.Client.Documents;
using Raven.Client.Exceptions;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class ProductContributionVoteRepository : RavenRepo, IProductContributionVoteRepository
    {
        public ProductContributionVoteRepository(IDocumentStore store) : base(store)
        {
        }

        public async Task<bool> AddVote(ProductContributionVote vote)
        {
            using var session = OpenWriteClusterSession();

            ProductContributionVoteCompareExchange.CreateProductContributionVote(session, vote);
            await session.StoreAsync(vote);

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

        public async Task RemoveVote(ProductContributionVote vote)
        {
            using var session = OpenWriteClusterSession();
            await ProductContributionVoteCompareExchange.DeleteProductContributionVote(session, vote);
            session.Delete(vote);

            await session.SaveChangesAsync();
        }

        public async Task<ProductContributionVoting> GetVoting(string productContributionId)
        {
            using var session = OpenReadOnlySession();

            return await session.Query<ProductContributionVoting, ProductContributionVote_ByProductContribution>()
                .FirstOrDefaultAsync(x => x.ProductContributionId == productContributionId);
        }
    }
}

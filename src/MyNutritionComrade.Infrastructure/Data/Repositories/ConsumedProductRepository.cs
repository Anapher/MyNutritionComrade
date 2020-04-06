using System;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Shared;
using Raven.Client.Documents;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class ConsumedProductRepository : RavenRepo, IConsumedProductRepository
    {
        private const string CollectionName = "consumedProduct/";

        public ConsumedProductRepository(IDocumentStore store) : base(store)
        {
        }

        public async ValueTask<ConsumedProduct?> FindExistingConsumedProduct(string userId, DateTime date, ConsumptionTime time, string productId)
        {
            using var session = OpenReadOnlySession();

            return await session.LoadAsync<ConsumedProduct?>(GetId(userId, date, time, productId));
        }

        public async Task Add(ConsumedProduct consumedProduct)
        {
            using var session = OpenWriteSession();
            await session.StoreAsync(consumedProduct, GetId(consumedProduct));
            await session.SaveChangesAsync();
        }

        public async Task Update(ConsumedProduct consumedProduct)
        {
            using var session = OpenWriteSession();

            await session.StoreAsync(consumedProduct, GetId(consumedProduct));
            await session.SaveChangesAsync();
        }

        public Task Delete(ConsumedProduct consumedProduct)
        {
            using var session = OpenWriteSession();

            session.Delete(GetId(consumedProduct));
            return session.SaveChangesAsync();
        }

        private static string GetId(ConsumedProduct consumed) => GetId(consumed.UserId, consumed.Date, consumed.Time, consumed.ProductId);

        private static string GetId(string userId, DateTime date, ConsumptionTime time, string productId) =>
            $"{CollectionName}/{userId}/{date:yyyy-MM-dd}/{(int) time}/{productId}";
    }
}

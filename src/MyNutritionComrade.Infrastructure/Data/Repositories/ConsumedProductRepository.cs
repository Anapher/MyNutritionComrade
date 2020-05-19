using System;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Extensions;
using MyNutritionComrade.Infrastructure.Shared;
using Raven.Client.Documents;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class ConsumedProductRepository : RavenRepo, IConsumedProductRepository
    {
        private const string CollectionName = "consumedProduct";

        public ConsumedProductRepository(IDocumentStore store) : base(store)
        {
        }

        public async Task Create(Consumed consumed)
        {
            using var session = OpenWriteSession();

            await session.StoreAsync(consumed, GetId(consumed));
            await session.SaveChangesAsync();
        }

        public async Task Delete(Consumed consumed)
        {
            using var session = OpenWriteSession();

            session.Delete(GetId(consumed));
            await session.SaveChangesAsync();
        }

        private static string GetId(Consumed consumed) => $"{CollectionName}/{consumed.Id}";
    }
}

using System;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
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

        private static string GetId(Consumed consumed) => GetId(consumed.UserId, consumed.Date, consumed.Time, consumed.FoodPortion.GetId());

        private static string GetId(string userId, DateTime date, ConsumptionTime time, string id) =>
            $"{CollectionName}/{userId}/{date:yyyy-MM-dd}/{(int) time}/{id}";
    }
}

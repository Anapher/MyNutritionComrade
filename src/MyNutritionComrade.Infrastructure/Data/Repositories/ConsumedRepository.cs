using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Data.Indexes;
using MyNutritionComrade.Infrastructure.Shared;
using Raven.Client.Documents;
using Raven.Client.Documents.Linq;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class ConsumedRepository : RavenRepo, IConsumedRepository
    {
        private const string CollectionName = "consumedProduct";

        public ConsumedRepository(IDocumentStore store) : base(store)
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

        public async Task<List<Consumed>> GetAll(string userId, DateTime dateTime, ConsumptionTime time)
        {
            using var session = OpenReadOnlySession();

            return await session.Query<Consumed, Consumed_ByDate>().Where(x => x.UserId == userId && x.Date == dateTime && x.Time == time).ToListAsync();
        }

        private static string GetId(Consumed consumed) => $"{CollectionName}/{consumed.Id}";
    }
}

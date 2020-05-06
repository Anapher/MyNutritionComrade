using System;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Data.Indexes;
using MyNutritionComrade.Infrastructure.Shared;
using Raven.Client.Documents;
using System.Linq;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class LoggedWeightRepository : RavenRepo, ILoggedWeightRepository
    {
        private static string GetId(string userId, DateTimeOffset timestamp) => $"loggedWeight/{userId}/{timestamp:O}";

        public LoggedWeightRepository(IDocumentStore store) : base(store)
        {
        }

        public async Task<double?> GetRecentAveragedWeight(string userId)
        {
            using var session = OpenReadOnlySession();
            // select the latest 12 logged weights
            var latestWeight = await session.Query<LoggedWeight, LoggedWeight_ByTimestamp>().Where(x => x.UserId == userId).OrderByDescending(x => x.Timestamp)
                .Take(12).ToListAsync();

            if (!latestWeight.Any())
                return null;

            // find the most recent logged weight
            var mostRecentWeight = latestWeight.First();

            // only work with the weights that were logged at a maximum of 7 days before the most recent
            // we do this eliminate averages of a far too huge time frame
            var beginningTime = mostRecentWeight.Timestamp.AddDays(-7);

            var usefulWeights = latestWeight.Where(x => x.Timestamp > beginningTime).ToList();

            // calculate average
            return usefulWeights.Sum(x => x.Value) / usefulWeights.Count;
        }

        public async Task Add(LoggedWeight loggedWeight)
        {
            using var session = OpenWriteSession();

            await session.StoreAsync(loggedWeight, GetId(loggedWeight.UserId, loggedWeight.Timestamp));
            await session.SaveChangesAsync();
        }

        public async Task Delete(string userId, DateTimeOffset timestamp)
        {
            using var session = OpenWriteSession();

            session.Delete(GetId(userId, timestamp));
            await session.SaveChangesAsync();
        }
    }
}

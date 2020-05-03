using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Shared;
using Raven.Client.Documents;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class NutritionGoalRepository : RavenRepo, INutritionGoalRepository
    {
        private static string GetId(string userId) => $"NutritionGoal/{userId}";

        public NutritionGoalRepository(IDocumentStore store) : base(store)
        {
        }

        public async Task<UserNutritionGoal?> GetByUser(string userId)
        {
            using var session = OpenReadOnlySession();

            return await session.LoadAsync<UserNutritionGoal?>(GetId(userId));
        }

        public async Task Save(string userId, UserNutritionGoal nutritionGoal)
        {
            using var session = OpenWriteSession();

            await session.StoreAsync(nutritionGoal, GetId(userId));
            await session.SaveChangesAsync();
        }
    }
}

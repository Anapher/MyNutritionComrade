using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Shared;
using Raven.Client.Documents;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class UserSettingsRepository : RavenRepo, IUserSettingsRepository
    {
        private static string GetId(string userId) => $"userSettings/{userId}";

        public UserSettingsRepository(IDocumentStore store) : base(store)
        {
        }

        public async Task<UserSettings?> GetUserSettings(string userId)
        {
            using var session = OpenReadOnlySession();

            return await session.LoadAsync<UserSettings?>(GetId(userId));
        }

        public async Task Save(string userId, UserSettings settings)
        {
            using var session = OpenWriteSession();

            await session.StoreAsync(settings, GetId(userId));
            await session.SaveChangesAsync();
        }
    }
}

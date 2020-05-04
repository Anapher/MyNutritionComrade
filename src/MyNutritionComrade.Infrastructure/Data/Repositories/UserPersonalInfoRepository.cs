using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Shared;
using Raven.Client.Documents;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class UserPersonalInfoRepository : RavenRepo, IUserPersonalInfoRepository
    {
        private static string GetId(string userId) => $"userPersonalInfo/{userId}";

        public UserPersonalInfoRepository(IDocumentStore store) : base(store)
        {
        }

        public async Task<UserPersonalInfo?> GetPersonalInfo(string userId)
        {
            using var session = OpenReadOnlySession();

            return await session.LoadAsync<UserPersonalInfo?>(GetId(userId));
        }

        public async Task SavePersonalInfo(string userId, UserPersonalInfo info)
        {
            using var session = OpenWriteSession();

            await session.StoreAsync(info, GetId(userId));
            await session.SaveChangesAsync();
        }
    }
}

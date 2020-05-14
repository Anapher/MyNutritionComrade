using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Account;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Shared;
using Raven.Client.Documents;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class UserRepository : RavenRepo, IUserRepository
    {
        public UserRepository(IDocumentStore store) : base(store)
        {
        }

        public async Task Create(User user)
        {
            using var session = OpenWriteSession();

            await session.StoreAsync(user, user.Id);
            await session.SaveChangesAsync();
        }

        public Task Update(User entity) => Create(entity);

        public async Task<User?> FindById(string userId)
        {
            using var session = OpenReadOnlySession();

            return await session.LoadAsync<User>(userId);
        }
    }
}

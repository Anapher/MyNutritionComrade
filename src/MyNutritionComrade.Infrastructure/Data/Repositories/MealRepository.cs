using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Shared;
using Raven.Client.Documents;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class MealRepository : RavenRepo, IMealRepository
    {
        public MealRepository(IDocumentStore store) : base(store)
        {
        }

        public async Task Create(Meal meal)
        {
            using var session = OpenWriteSession();

            await session.StoreAsync(meal);
            await session.SaveChangesAsync();
        }

        public async Task<Meal?> FindById(string mealId)
        {
            using var session = OpenReadOnlySession();

            return await session.LoadAsync<Meal>(mealId);
        }

        public async Task Delete(Meal meal)
        {
            using var session = OpenWriteSession();

            session.Delete(meal.Id);
            await session.SaveChangesAsync();
        }
    }
}

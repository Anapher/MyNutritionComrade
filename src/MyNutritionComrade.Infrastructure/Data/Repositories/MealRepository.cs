using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Infrastructure.Shared;

namespace MyNutritionComrade.Infrastructure.Data.Repositories
{
    public class MealRepository : EfRepository<Meal>, IMealRepository
    {
        public MealRepository(AppDbContext appDbContext) : base(appDbContext)
        {
        }
    }
}

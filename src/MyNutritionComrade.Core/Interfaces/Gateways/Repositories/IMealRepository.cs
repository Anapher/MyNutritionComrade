using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IMealRepository
    {
        Task Create(Meal meal);
        Task Update(Meal meal);

        Task<Meal?> FindById(string mealId);
        Task Delete(Meal meal);
    }
}

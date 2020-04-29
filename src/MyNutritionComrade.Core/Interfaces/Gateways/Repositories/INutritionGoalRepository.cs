using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface INutritionGoalRepository
    {
        Task<UserNutritionGoal?> GetByUser(string userId);
        Task Save(string userId, UserNutritionGoal nutritionGoal);
    }
}

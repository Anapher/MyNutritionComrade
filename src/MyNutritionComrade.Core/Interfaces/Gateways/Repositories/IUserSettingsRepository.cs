using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IUserSettingsRepository
    {
        Task<UserSettings?> GetUserSettings(string userId);
        Task Save(string userId, UserSettings settings);
    }
}

using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IUserPersonalInfoRepository
    {
        Task<UserPersonalInfo?> GetPersonalInfo(string userId);
        Task SavePersonalInfo(string userId, UserPersonalInfo info);

    }
}

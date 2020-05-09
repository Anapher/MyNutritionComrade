using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Account;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IUserRepository
    {
        Task Create(User user);
        Task Update(User entity);
        Task<User?> FindById(string userId);
    }
}

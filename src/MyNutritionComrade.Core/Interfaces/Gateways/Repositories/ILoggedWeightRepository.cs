using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface ILoggedWeightRepository
    {
        Task<double?> GetRecentAveragedWeight(string userId);
        Task Add(LoggedWeight loggedWeight);
    }
}

using System.Threading.Tasks;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface ILoggedWeightRepository
    {
        Task<double?> GetRecentAveragedWeight(string userId);
    }
}

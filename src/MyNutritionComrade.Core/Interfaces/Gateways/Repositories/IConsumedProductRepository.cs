using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities.Consumption;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IConsumedProductRepository
    {
        Task Create(Consumed consumed);
        Task Delete(Consumed consumed);
    }
}

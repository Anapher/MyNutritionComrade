using System;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Domain.Entities;

namespace MyNutritionComrade.Core.Interfaces.Gateways.Repositories
{
    public interface IConsumedProductRepository
    {
        ValueTask<ConsumedProduct?> FindExistingConsumedProduct(string userId, DateTime date, ConsumptionTime time, string productId);
        Task Add(ConsumedProduct consumedProduct);
        Task Update(ConsumedProduct consumedProduct);
        Task Delete(ConsumedProduct consumedProduct);
    }
}
